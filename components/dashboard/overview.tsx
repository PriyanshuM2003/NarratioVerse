"use client";
import GetMonthlyRevenues from "@/routes/getMonthlyRevenues";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Skeleton } from "../ui/skeleton";

export function Overview() {
  const { monthlyRevenues, loadingMonthlyRevenues } = GetMonthlyRevenues();

  return (
    <>
      {loadingMonthlyRevenues ? (
        <div className="flex gap-4 px-4">
        {Array.from({ length: 12 }, (_, index) => (
          <Skeleton key={index} className="h-96 w-10" />
        ))}
      </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyRevenues}>
              <XAxis
                dataKey="month"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Bar
                dataKey="revenue"
                fill="currentColor"
                radius={[4, 4, 0, 0]}
                className="fill-primary"
              />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </>
  );
}
