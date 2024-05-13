import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GetDashboardCounts(): {
  followersCount: number | null;
  totalStreams: number | null;
  totalRevenue: number | null;
  loadingDashboardCounts: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingDashboardCounts, setLoadingDashboardCounts] =
    useState<boolean>(true);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalStreams, setTotalStreams] = useState<number | null>(null);

  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        setLoadingDashboardCounts(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getdashboardcounts`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data = await response.json();

        setFollowersCount(data.followersCount);
        setTotalRevenue(data.totalRevenue);
        setTotalStreams(data.totalStreams);
      } catch (error) {
        console.error("Error fetching dashboard counts data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch dashboard counts",
        });
      } finally {
        setLoadingDashboardCounts(false);
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      fetchDashboardCounts();
    }
  }, [router, toast]);

  return {
    followersCount,
    totalStreams,
    totalRevenue,
    loadingDashboardCounts,
  };
}
