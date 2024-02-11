import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized: Missing token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decoded || !decoded.userId) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
      const { slug, accept } = req.body;

      if (accept) {
        await prisma.participant.update({
          where: {
            slug: slug,
            email: decoded.email,
          },
          data: {
            accepted: true,
          },
        });
      }
      return res
        .status(200)
        .json({ message: "Invitation accepted successfully" });
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return res.status(500).json({ error: "Something went wrong." });
  }
}
