import prisma from "@/lib/prisma";
import jwt, { Secret } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";

interface MonthlyIncome {
  year: number;
  months: {
    [month: string]: number;
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "PUT") {
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

      const { audioId } = req.body;
      if (!audioId) {
        return res.status(400).json({ error: "audioId is required" });
      }

      const audio = await prisma.audio.findUnique({
        where: { id: audioId },
        select: { userId: true },
      });

      if (!audio) {
        return res.status(404).json({ error: "Audio not found" });
      }

      const userId = audio.userId;

      await prisma.audio.update({
        where: { id: audioId },
        data: {
          streams: {
            increment: 1,
          },
        },
      });

      await prisma.totalCounts.updateMany({
        where: { userId: userId },
        data: {
          totalStreams: {
            increment: 1,
          },
        },
      });

      const totalCounts = await prisma.totalCounts.findFirst({
        where: { userId: userId },
        select: { totalStreams: true, totalRevenue: true },
      });

      if (!totalCounts) {
        return res.status(500).json({ error: "TotalCounts not found" });
      }

      const totalStreams = totalCounts.totalStreams + 1;
      const newTotalRevenue = (totalStreams * 0.003).toFixed(3);

      await prisma.totalCounts.updateMany({
        where: { userId: userId },
        data: {
          totalRevenue: parseFloat(newTotalRevenue),
        },
      });

      await updateMonthlyIncome(
        userId,
        new Date(),
        parseFloat(newTotalRevenue)
      );

      return res
        .status(200)
        .json({ message: "Stream count and revenue updated successfully" });
    } else {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error) {
    console.error("Error updating peer data:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
}

async function updateMonthlyIncome(
  userId: string,
  currentDate: Date,
  newRevenue: number
) {
  const totalCount = await prisma.totalCounts.findFirst({
    where: { userId: userId },
    select: { monthlyIncome: true },
  });

  if (!totalCount) {
    return;
  }

  const existingMonthlyIncome = totalCount.monthlyIncome || [];
  let monthlyIncomeData: MonthlyIncome[] = existingMonthlyIncome.map((income) =>
    typeof income === "string" ? JSON.parse(income) : income
  );

  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "short" });

  let yearData = monthlyIncomeData.find((data) => data.year === year);
  if (!yearData) {
    yearData = { year: year, months: {} };
    monthlyIncomeData.push(yearData);
  }

  yearData.months[month] = (yearData.months[month] || 0) + newRevenue;

  const updatedMonthlyIncome = monthlyIncomeData.map((data) =>
    JSON.stringify(data)
  );

  await prisma.totalCounts.updateMany({
    where: { userId: userId },
    data: { monthlyIncome: updatedMonthlyIncome },
  });
}
