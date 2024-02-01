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

      const { podcastName, podcastImage, genres, keywords, podcastParts } =
        req.body;

      const podcastNameAudioParts = podcastParts.map((part) => ({
        partName: part.partName,
        audioUrl: part.audioUrl,
      }));

      const createdPodcast = await prisma.podcast.create({
        data: {
          podcastName,
          podcastImage,
          genres: { set: genres },
          keywords: { set: keywords },
          podcastParts: { set: podcastNameAudioParts },
          userId: decoded.id,
        },
      });

      return res.status(200).json({ podcast: createdPodcast });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
