import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1y",
  });
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

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

      if (!user.isVerified) {
        return res.status(401).json({ error: "User not verified." });
      }

      const accessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
      );

      const refreshToken = generateRefreshToken(user.id);

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
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(401).json({ error: "Refresh token not provided." });
      }

      const decodedRefreshToken = verifyRefreshToken(refreshToken);

      if (!decodedRefreshToken) {
        return res.status(401).json({ error: "Invalid refresh token." });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: decodedRefreshToken.id,
        },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }

      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1d",
        }
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
