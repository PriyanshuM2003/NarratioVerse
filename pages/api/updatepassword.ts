import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextApiRequest, NextApiResponse } from "next";

interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "PUT") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(token as string, process.env.ACCESS_TOKEN_SECRET as Secret) as { id?: string };

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { currentPassword, newPassword }: PasswordData = req.body;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(400).json({ error: "Invalid current password" });
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          password: hashedNewPassword,
        },
      });

      return res.status(200).json({ user: updatedUser });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
