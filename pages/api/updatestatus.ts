import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PUT") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token as string,
        process.env.ACCESS_TOKEN_SECRET as Secret
      ) as { id?: string };

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { roomId } = req.body;
      if (!roomId) {
        return res
          .status(400)
          .json({ error: "Missing roomId in request body" });
      }

      await prisma.liveTalk.update({
        where: { roomId },
        data: {
          status: false,
        },
      });

      return res.status(200).json({ message: "Status updated successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating peer data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
