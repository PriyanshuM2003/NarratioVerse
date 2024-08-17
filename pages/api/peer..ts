import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface UpdatePeerData {
  roomId: string;
  peerId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PUT") {
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

      const { roomId, peerId }: UpdatePeerData = req.body;
      const userId = decoded.id;

      const participant = await prisma.liveTalkParticipant.findFirst({
        where: {
          AND: [{ userId }, { roomId }],
        },
      });

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      const updatedParticipant = await prisma.liveTalkParticipant.update({
        where: {
          id: participant.id,
        },
        data: {
          peerId,
        },
      });

      return res.status(200).json({ message: "Update successful" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating peer data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
