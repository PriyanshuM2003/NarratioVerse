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

      const now = new Date();
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
      const monthlyRevenues = [];

      for (let i = 0; i < 12; i++) {
        const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const startOfMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          targetDate.getFullYear(),
          targetDate.getMonth() + 1,
          0
        );

        const userMonthlyAudios = await prisma.audio.findMany({
          where: {
            userId: decoded.id,
            createdAt: {
              gte: startOfMonth,
              lt: endOfMonth,
            },
          },
          select: {
            streams: true,
          },
        });

        const monthlyStreams = userMonthlyAudios.reduce(
          (total, audio) => total + audio.streams,
          0
        );

        const monthlyRevenue = (monthlyStreams * 0.003).toFixed(3);

        const monthName = startOfMonth.toLocaleString("default", {
          month: "short",
        });
        const monthIndex = monthsOrder.indexOf(monthName);
        monthlyRevenues[monthIndex] = {
          month: monthName,
          revenue: Number(monthlyRevenue),
        };
      }
      return res.status(200).json({ monthlyRevenues });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error fetching monthly revenue data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
