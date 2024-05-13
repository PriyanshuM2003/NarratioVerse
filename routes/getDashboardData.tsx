import { useToast } from "@/components/ui/use-toast";
import { Audio } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GetDashboardData(): {
  followersCount: number | null;
  totalStreams: number | null;
  totalRevenue: number | null;
  topAudios: Audio[] | null;
  loadingDashboardData: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingDashboardData, setLoadingDashboardData] =
    useState<boolean>(true);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);
  const [totalStreams, setTotalStreams] = useState<number | null>(null);
  const [topAudios, setTopAudios] = useState<Audio[] | null>(null);

  useEffect(() => {
    const fetchFollowersCount = async () => {
      try {
        setLoadingDashboardData(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getdashboarddata`,
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
        setTopAudios(data.topAudios);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch dashboard data",
        });
      } finally {
        setLoadingDashboardData(false);
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      fetchFollowersCount();
    }
  }, [router, toast]);

  return {
    followersCount,
    topAudios,
    totalStreams,
    totalRevenue,
    loadingDashboardData,
  };
}
