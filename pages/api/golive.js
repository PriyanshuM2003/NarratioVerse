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

      const { title, record, genres, slug, participants } = req.body;
      const { id: hostUserId } = decoded;

      const hostUser = await prisma.user.findUnique({
        where: {
          id: hostUserId,
        },
      });

      if (!hostUser) {
        return res.status(404).json({ error: "Host user not found" });
      }

      const hostname = req.headers.host;
      const guestUserIds = [];

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
          slug,
          hostUserId,
          participants: {
            create: guestUserIds.map((guestUserId) => ({
              guestUserId,
            })),
          },
        },
        include: {
          participants: true,
        },
      });

      return res.status(200).json({
        liveTalk: createdLiveTalk,
        hostname,
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
