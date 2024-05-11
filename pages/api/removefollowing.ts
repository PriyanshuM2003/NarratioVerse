import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";

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
        process.env.JWT_SECRET_KEY as Secret
      ) as { id?: string };

      if (!decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { creatorId } = req.body;

      const creator = await prisma.user.findUnique({
        where: { id: creatorId },
      });
      if (!creator) {
        return res.status(404).json({ error: "Creator not found" });
      }

      const follower = await prisma.follower.findFirst({
        where: {
          userId: decoded.id,
        },
      });

      if (!follower) {
        return res.status(404).json({ error: "Follower not found" });
      }

      const updatedFollowedId = follower.followedId.filter(
        (id) => id !== creatorId
      );

      const updatedFollower = await prisma.follower.update({
        where: {
          id: follower.id,
        },
        data: {
          followedId: updatedFollowedId,
        },
      });

      return res
        .status(200)
        .json({ message: "Follower removed successfully", updatedFollower });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error adding followers:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
