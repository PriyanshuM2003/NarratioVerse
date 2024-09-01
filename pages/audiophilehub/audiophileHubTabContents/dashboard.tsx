"use client";
import React, { useEffect, useState } from "react";
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker";
import { Overview } from "@/components/dashboard/overview";
import { TopAudios } from "@/components/dashboard/top-audios";
import { Search } from "@/components/dashboard/search";
import GetDashboardCounts from "@/routes/getDashboardCounts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import GetMonthlyRevenues from "@/routes/getMonthlyRevenues";
import { Button } from "@/components/ui/button";
interface MonthlyIncome {
  year: number;
  months: {
    [month: string]: number;
  };
}

const Dashboard = () => {
  const { followersCount, totalCounts, loadingDashboardCounts } =
    GetDashboardCounts();

  const { monthlyRevenues, loadingMonthlyRevenues } = GetMonthlyRevenues();

  console.log("monthlyRevenues", monthlyRevenues);

  return (
    <>
      <div className="px-8 pb-4 min-h-screen space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              {loadingDashboardCounts ? (
                <>
                  <Skeleton className="h-8" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {totalCounts?.totalRevenue}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Followers</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              {loadingDashboardCounts ? (
                <>
                  <Skeleton className="h-8" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">{followersCount}</div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Streams
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              {loadingDashboardCounts ? (
                <>
                  <Skeleton className="h-8" />
                </>
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {totalCounts?.totalStreams}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-center pt-6">
              <Button disabled>Pay Request</Button>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Your Top 5 Trending Audios</CardTitle>
            </CardHeader>
            <CardContent>
              <TopAudios />
            </CardContent>
          </Card>
          {/* <Card className="col-span-4">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div>Monthly Overview</div>
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                 {years.map((year: number, index: number) => (
                        <SelectItem key={index} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))} 
                    </SelectContent>
                  </Select>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
             <Overview loadingMonthlyRevenues={loadingMonthlyRevenues} />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
