import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decoded = jwt.verify(
        token as string,
        process.env.JWT_SECRET_KEY as Secret
      ) as { id?: string };

      if (!decoded || !decoded.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const monthsOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      const monthlyRevenues = await prisma.totalCounts.findFirst({
        where: { userId: decoded.id },
        select: {
          monthlyIncome: true,
        },
      });

      return res.status(200).json({ monthlyRevenues });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching monthly revenue data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
