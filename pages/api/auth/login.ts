import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Please provide email and password." });
      }
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      if (!user.isVerified) {
        return res.status(401).json({ error: "User not verified." });
      }

      const accessToken = generateAccessToken({ id: user.id });
      const refreshToken = generateRefreshToken({ id: user.id });

      await prisma.tokens.upsert({
        where: { userId: user.id },
        update: { refreshToken },
        create: {
          userId: user.id,
          refreshToken,
        },
      });

      return res.status(200).json({ accessToken, refreshToken });
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return res
      .status(500)
      .json({ error: "Something went wrong while authenticating the user." });
  }
}
