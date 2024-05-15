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
        process.env.JWT_SECRET_KEY as Secret
      ) as { id?: string };

      if (!decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { audioId } = req.body;

      const audio = await prisma.audio.findFirst({
        where: {
          id: audioId,
          userId: decoded.id,
        },
      });

      if (!audio) {
        return res.status(404).json({ error: "Audio not found" });
      }

      const { coverImage, category, parts } = audio;
      const coverImageFileName = decodeURIComponent(
        coverImage.split("/").pop() || ""
      );

      if (coverImageFileName) {
        const { data: removeData, error: removeError } = await supabase.storage
          .from("Images")
          .remove([`${category}/${coverImageFileName}`]);

        if (removeError) {
          console.error("Error removing audio image:", removeError);
        } else {
          console.log("Audio image removed successfully:", removeData);
        }
      }

      for (const audioPart of parts as unknown as AudioPart[]) {
        const audioFileName = audioPart.audioUrl.split("/").pop();

        if (audioFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("AudioFiles")
              .remove([`${category}/${audioFileName}`]);

          if (removeError) {
            console.error("Error removing audio file:", removeError);
          } else {
            console.log("Audio file removed successfully:", removeData);
          }
        }
      }

      await prisma.audio.delete({
        where: {
          id: audioId,
        },
      });

      return res.status(200).json({ message: "Audio deleted successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error deleting audio:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
