import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GetTotalRevenue(): {
  totalRevenue: number | null;
  loadingTotalRevenue: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingTotalRevenue, setLoadingTotalRevenue] = useState<boolean>(true);
  const [totalRevenue, setTotalRevenue] = useState<number | null>(null);

  useEffect(() => {
    const fetchFollowersCount = async () => {
      try {
        setLoadingTotalRevenue(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/gettotalrevenue`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch  followers count data");
        }

        const data = await response.json();

        setTotalRevenue(data.totalRevenue);
      } catch (error) {
        console.error("Error fetching followers count:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch  followers count data",
        });
      } finally {
        setLoadingTotalRevenue(false);
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      fetchFollowersCount();
    }
  }, [router, toast]);

  return { totalRevenue, loadingTotalRevenue };
}
