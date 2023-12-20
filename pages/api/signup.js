import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, email, phone, password, country, state } = req.body;

      if (!name || !email || !phone || !password || !country || !state) {
        return res
          .status(400)
          .json({ error: "Please provide all required fields." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: hashedPassword,
          country,
          state,
        },
      });

      return res
        .status(200)
        .json({ message: "User created successfully", user });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while creating the user." });
  }
}
