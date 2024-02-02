import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      const userAudio = await prisma.audio.findMany({
        where: {
          userId: decoded.id,
        },
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          category: true,
          genres: true,
          keywords: true,
          parts: true,
          userId: true,
        },
      });

      return res.status(200).json({ userAudio: userAudio });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error getting audio data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
