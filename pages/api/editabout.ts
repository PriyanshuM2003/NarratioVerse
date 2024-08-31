import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";

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

      if (!decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { audioId, about } = req.body;

      if (!audioId || !about) {
        return res.status(400).json({ error: "Invalid request body" });
      }
      const audio = await prisma.audio.findFirst({
        where: {
          id: audioId,
          userId: decoded.id,
        },
      });

      if (!audio) {
        return res.status(404).json({ error: "Audio not found" });
      }

      await prisma.audio.update({
        where: { id: audioId },
        data: { about },
      });

      return res.status(200).json({ message: "About updated successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error updating about:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
