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
      const {
        audiobookName,
        audiobookImage,
        genres,
        keywords,
        audiobookParts,
      } = req.body;

      const audiobookNameAudioParts = audiobookParts.map((part) => ({
        partName: part.partName,
        audioUrl: part.audioUrl,
      }));

      const createdaudiobook = await prisma.audiobook.create({
        data: {
          audiobookName,
          audiobookImage,
          genres: { set: genres },
          keywords: { set: keywords },
          audiobookParts: { set: audiobookNameAudioParts },
          userId: decoded.id,
        },
      });

      return res.status(200).json({ audiobook: createdaudiobook });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
