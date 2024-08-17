import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";

interface Part {
  partName: string;
  audioUrl: string;
}

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

      const { title, coverImage, category, genres, parts } = req.body;

      const audioParts = parts.map((part: Part) => ({
        partName: part.partName,
        audioUrl: part.audioUrl,
      }));

      const createdUserAudio = await prisma.audio.create({
        data: {
          title,
          coverImage,
          category,
          genres: { set: genres },
          parts: { set: audioParts },
          userId: decoded.id,
        },
      });

      return res.status(200).json({ userAudio: createdUserAudio });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error creating audio data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
