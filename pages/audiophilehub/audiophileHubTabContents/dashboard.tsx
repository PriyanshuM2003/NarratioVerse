"use client";
import React from "react";
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
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { followersCount, totalStreams, totalRevenue, loadingDashboardCounts } =
    GetDashboardCounts();
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
                  <div className="text-2xl font-bold">{totalRevenue}</div>
                </>
              )}
              {/* <p className="text-xs text-muted-foreground">
        +20.1% from last month
    </p> */}
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
              {/* <p className="text-xs text-muted-foreground">
        +180.1% from last month
    </p> */}
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
                  <div className="text-2xl font-bold">{totalStreams}</div>
                </>
              )}
              {/* <p className="text-xs text-muted-foreground">
        +19% from last month
    </p> */}
            </CardContent>
          </Card>
          {/* <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
    <CardTitle className="text-sm font-medium">
    Active Now
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
    <div className="text-2xl font-bold">+573</div>
    <p className="text-xs text-muted-foreground">
    +201 since last hour
    </p>
    </CardContent>
</Card> */}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Your Top 5 Trending Audios</CardTitle>
              {/* <CardDescription>
        You made 265 sales this month.
    </CardDescription> */}
            </CardHeader>
            <CardContent>
              <TopAudios />
            </CardContent>
          </Card>
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
