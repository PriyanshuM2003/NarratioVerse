import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "DELETE") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token as string,
        process.env.ACCESS_TOKEN_SECRET as Secret
      ) as { id?: string };

      if (!decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { playlistId } = req.body;

      const playlist = await prisma.playlist.findFirst({
        where: {
          id: playlistId,
          userId: decoded.id,
        },
      });

      if (!playlist) {
        return res.status(404).json({ error: "Playlist not found" });
      }

      await prisma.playlist.delete({
        where: {
          id: playlistId,
        },
      });

      return res.status(200).json({ message: "Playlist deleted successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error adding followers:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
