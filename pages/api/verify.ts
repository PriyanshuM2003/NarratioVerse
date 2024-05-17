import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface TokenData {
  token: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { token }: TokenData = req.body;
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as Secret
      ) as { email: string };
      const user = await prisma.user.findUnique({
        where: { email: decodedToken.email },
        include: { Tokens: true },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid User" });
      }

      const verificationToken = user.Tokens?.find(
        (t) => t.verificationToken === token
      );

      if (!verificationToken) {
        return res.status(400).json({ error: "Invalid Token" });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: "User is already verified" });
      }

      if (user.isVerified) {
        return res.status(400).json({ error: "User is already verified" });
      }
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isVerified: true,
        },
      });

      await prisma.tokens.updateMany({
        where: { userId: user.id, verificationToken: token },
        data: {
          verificationToken: "",
        },
      });

      return res.status(200).json({ message: "Email verified successfully" });
    } else {
      return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error("Error verifying email:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }

    return res
      .status(500)
      .json({ error: "Something went wrong while verifying the email." });
  }
}
