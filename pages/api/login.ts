import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

const generateRefreshToken = async (userId: string) => {
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET as Secret,
    {
      expiresIn: "7d",
    }
  );

  await prisma.tokens.upsert({
    where: { userId },
    update: { refreshToken },
    create: {
      userId,
      refreshToken,
      verificationToken: "",
    },
  });

  return refreshToken;
};

const verifyRefreshToken = async (token: string) => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as Secret
    );
    const storedToken = await prisma.tokens.findUnique({
      where: { userId: (decoded as { id: string }).id },
    });

    if (storedToken?.refreshToken === token) {
      return decoded;
    }
    return null;
  } catch (error) {
    return null;
  }
};

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

      if (!user || !user.isVerified) {
        return res
          .status(401)
          .json({ error: "Invalid credentials or user not verified." });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid credentials." });
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY as Secret,
        { expiresIn: "1d" }
      );

      const refreshToken = await generateRefreshToken(user.id);

      const userResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: userResponse,
      });
    } else if (req.method === "GET") {
      const refreshToken = req.headers.authorization?.split(" ")[1];

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token not provided." });
      }

      const decodedRefreshToken = await verifyRefreshToken(refreshToken);

      if (!decodedRefreshToken) {
        return res.status(401).json({ error: "Invalid refresh token." });
      }

      const userId = (decodedRefreshToken as { id: string }).id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }

      const newAccessToken = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET_KEY as Secret,
        { expiresIn: "1d" }
      );

      return res.status(200).json({ accessToken: newAccessToken });
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
