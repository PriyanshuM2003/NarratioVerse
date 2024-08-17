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
        process.env.ACCESS_TOKEN_SECRET as Secret
      ) as { id?: string };

      if (!decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        include: { playlists: { include: { audios: true } } },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const { name, audioId } = req.body;

      const existingPlaylist = user.playlists.find(
        (playlist) => playlist.name === name
      );

      if (existingPlaylist) {
        if (existingPlaylist.audios.every((audio) => audio.id !== audioId)) {
          const updatedPlaylist = await prisma.playlist.update({
            where: { id: existingPlaylist.id },
            data: {
              audios: {
                connect: { id: audioId },
              },
            },
          });

          return res.status(200).json(updatedPlaylist);
        } else {
          return res
            .status(400)
            .json({ error: "Playlist name already exists" });
        }
      }

      const newPlaylist = await prisma.playlist.create({
        data: {
          name,
          userId: decoded.id,
          audios: {
            connect: { id: audioId },
          },
        },
      });

      return res.status(200).json(newPlaylist);
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error adding followers:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
