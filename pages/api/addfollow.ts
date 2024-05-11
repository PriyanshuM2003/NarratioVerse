import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";

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

      let follower = await prisma.follower.findFirst({
        where: {
          userId: decoded.id,
        },
      });

      if (follower) {
        if (!follower.followedId.includes(creatorId)) {
          follower = await prisma.follower.update({
            where: { id: follower.id },
            data: {
              followedId: {
                push: creatorId,
              },
            },
          });
        }
      } else {
        follower = await prisma.follower.create({
          data: {
            userId: decoded.id,
            followedId: [creatorId],
          },
        });
      }

      return res
        .status(200)
        .json({ message: "Follower added successfully", follower });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error adding followers:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
