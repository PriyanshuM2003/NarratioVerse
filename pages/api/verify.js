import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  try {

    const { token } = req.body;
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { email: decodedToken.email },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    if (user.isVerified) {
      return res.status(400).json({ error: "User is already verified" });
    }
    await prisma.user.update({
      where: { email: decodedToken.email },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(400).json({ error: "Token has expired" });
    }

    return res
      .status(500)
      .json({ error: "Something went wrong while verifying the email." });
  }
}
