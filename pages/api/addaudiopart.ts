import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
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

      const { audioId, partName, audioUrl } = req.body;

      if (!audioId || !partName || !audioUrl) {
        return res.status(400).json({ error: "Missing required fields" });
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
        data: {
          parts: {
            push: {
              audioUrl,
              partName,
            },
          },
        },
      });
      return res.status(200).json({ message: "Audio part added successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error adding audio part:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
