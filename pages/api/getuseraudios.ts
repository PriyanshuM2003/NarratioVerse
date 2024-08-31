import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
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

      const category = req.query.category as string;

      const userAudios = await prisma.audio.findMany({
        where: {
          userId: decoded.id,
          category,
        },
      });

      return res.status(200).json({ userAudios });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error getting audio data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
