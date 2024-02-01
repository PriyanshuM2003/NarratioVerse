import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    if (req.method === "PUT") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { id, name, email, phone, country, state, bio, profileImage } =
        req.body;

      const updatedUser = await prisma.user.update({
        where: { id: decoded.id },
        data: {
          name,
          email,
          phone,
          country,
          state,
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
