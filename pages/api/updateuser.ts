import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  bio: string;
  profileImage: string;
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

      const { name, email, phone, country, bio, profileImage }: UserData =
        req.body;

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          name,
          email,
          phone,
          country,
          bio,
          profileImage,
        },
      });

      return res.status(200).json({ user: updatedUser });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
