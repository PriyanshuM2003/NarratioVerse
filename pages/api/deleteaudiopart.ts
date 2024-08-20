import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import supabase from "@/lib/supabase";
import jwt, { Secret } from "jsonwebtoken";

interface AudioPart {
  audioUrl: string;
  partName: string;
}

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

      const { audioId, partToDelete } = req.body;

      if (
        !partToDelete ||
        typeof partToDelete !== "object" ||
        !partToDelete.audioURL
      ) {
        return res.status(400).json({ error: "Invalid request body" });
      }

      const audio = await prisma.audio.findFirst({
        where: {
          id: audioId,
          userId: decoded.id,
        },
      });

      if (!audio) {
        return res.status(404).json({ error: "Audio not found" });
      }

      const { category, parts } = audio;
      const audioFileName = partToDelete.audioURL.split("/").pop();

      if (audioFileName) {
        const { data: removeData, error: removeError } = await supabase.storage
          .from("AudioFiles")
          .remove([`${category}/${audioFileName}`]);

        if (removeError) {
          console.error("Error removing audio file:", removeError);
          return res.status(500).json({ error: "Failed to remove audio file" });
        } else {
          console.log("Audio file removed successfully:", removeData);
        }
      }

      const updatedParts = (parts as unknown as AudioPart[]).filter(
        (part) => part.audioUrl !== partToDelete.audioURL
      ) as any[];

      if (updatedParts.length === 0) {
        await prisma.audio.delete({
          where: { id: audioId },
        });
      } else {
        await prisma.audio.update({
          where: { id: audioId },
          data: { parts: updatedParts },
        });
      }
      return res
        .status(200)
        .json({ message: "Audio part deleted successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error deleting audio:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
