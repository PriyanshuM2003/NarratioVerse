import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { subDays } from "date-fns";

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

      const userPreferences = await prisma.preferences.findFirst({
        where: {
          userId: decoded.id,
        },
      });

      if (!userPreferences) {
        return res.status(404).json({ error: "User preferences not found" });
      }

      const { genres } = userPreferences;

      const fiveDaysAgo = subDays(new Date(), 5);

      const madeForYouData = await prisma.audio.findMany({
        where: {
          genres: {
            hasSome: genres,
          },
          createdAt: {
            gte: fiveDaysAgo,
          },
        },
        include: {
          user: true,
        },
      });
      if (madeForYouData.length === 0) {
        const fallbackData = await prisma.audio.findMany({
          where: {
            genres: {
              hasSome: genres,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 10,
          include: {
            user: true,
          },
        });

        return res.status(200).json({ madeForYouData: fallbackData });
      }

      return res.status(200).json({ madeForYouData });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching preferences:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
