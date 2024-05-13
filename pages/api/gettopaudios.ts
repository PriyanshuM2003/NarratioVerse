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
        process.env.JWT_SECRET_KEY as Secret
      ) as { id?: string };

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const followersCount = await prisma.follower.count({
        where: {
          followedId: {
            has: decoded.id,
          },
        },
      });

      const userAudios = await prisma.audio.findMany({
        where: {
          userId: decoded.id,
        },
        select: {
          streams: true,
        },
      });

      const totalStreams = userAudios.reduce(
        (total, audio) => total + audio.streams,
        0
      );

      const totalRevenue = totalStreams * 0.003;

      const topAudios = await prisma.audio.findMany({
        where: {
          userId: decoded.id,
        },
        orderBy: {
          streams: "desc",
        },
        take: 5,
      });

      return res.status(200).json({ topAudios });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching following data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
