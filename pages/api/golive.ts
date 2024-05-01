import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface Participant {
  email: string;
}

interface LiveTalkData {
  title: string;
  record: boolean;
  genres: string[];
  roomId: string;
  participants: Participant[];
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
        process.env.JWT_SECRET_KEY as Secret
      ) as { id?: string };

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { title, record, genres, roomId, participants }: LiveTalkData =
        req.body;

      const { id: hostUserId } = decoded;

      const hostUser = await prisma.user.findUnique({
        where: {
          id: hostUserId,
        },
      });

      if (!hostUser) {
        return res.status(404).json({ error: "Host user not found" });
      }

      const guestUserIds: string[] = [];

      for (const participant of participants) {
        const user = await prisma.user.findUnique({
          where: {
            email: participant.email,
          },
          select: {
            id: true,
          },
        });
        if (user) {
          guestUserIds.push(user.id);
        } else {
          console.error("User not found for email:", participant.email);
        }
      }
      const createdLiveTalk = await prisma.liveTalk.create({
        data: {
          title,
          record,
          genres,
          roomId,
          status: true,
          userId: hostUserId,
          participants: {
            create: [
              { userId: hostUserId, isHost: true, roomId },
              ...guestUserIds.map((guestUserId) => ({
                userId: guestUserId,
                roomId,
              })),
            ],
          },
        },
        include: {
          participants: true,
        },
      });

      return res.status(200).json({
        liveTalk: createdLiveTalk,
        hostname: req.headers.host,
        hostUserName: hostUser.name,
      });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error creating live data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
