import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

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

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id, languages, genres } = req.body;

      if (!id || !languages || !genres) {
        return res.status(400).json({ error: "Missing parameters" });
      }


      let preferences = await prisma.preferences.update({
        where: { id },
        data: {
          languages,
          genres,
        },
      });

      return res.status(200).json({
        message: "Preferences updated successfully",
        preferences,
      });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
