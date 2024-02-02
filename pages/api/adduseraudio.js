import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { title, slug, coverImage, category, genres, keywords, parts } =
        req.body;

      const audioParts = parts.map((part) => ({
        partName: part.partName,
        audioUrl: part.audioUrl,
      }));

      const createdUserAudio = await prisma.audio.create({
        data: {
          title,
          slug,
          coverImage,
          category,
          genres: { set: genres },
          keywords: { set: keywords },
          parts: { set: audioParts },
          userId: decoded.id,
        },
      });

      return res.status(200).json({ userAudio: createdUserAudio });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error creating audio data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
