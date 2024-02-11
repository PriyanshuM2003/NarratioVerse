import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }

      const { uniqueToken } = req.body;

      const updatedParticipant = await prisma.liveTalkParticipant.updateMany({
        where: {
          guestUserId: decoded.userId,
          accepted: false,
          uniqueToken: uniqueToken,
        },
        data: {
          accepted: true,
        },
        select: {
          liveTalk: {
            select: {
              slug: true,
              title: true,
              hostUser: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (updatedParticipant) {
        const { liveTalk } = updatedParticipant;
        const { slug, title, hostUser } = liveTalk;
        const hostname = hostUser.name;
        return res.status(200).json({ slug, title, hostname, uniqueToken });
      } else {
        return res.status(404).json({ error: "Live Talk not found" });
      }
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}