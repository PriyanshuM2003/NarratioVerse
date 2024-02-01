import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
