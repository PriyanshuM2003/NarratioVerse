import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide email and password." });
      }

      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const token = jwt.sign({ userId: user.id }, "your_secret_key", {
        expiresIn: "1d",
      });

      return res.status(200).json({ message: "Login successful", token, user });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while authenticating the user." });
  }
}
