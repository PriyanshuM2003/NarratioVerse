import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GetMonthlyRevenues(): {
  monthlyRevenues: any[] | undefined;
  loadingMonthlyRevenues: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingMonthlyRevenues, setLoadingMonthlyRevenues] =
    useState<boolean>(true);
  const [monthlyRevenues, setMonthlyRevenues] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    const fetchMonthlyRevenues = async () => {
      try {
        setLoadingMonthlyRevenues(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getmonthlyrevenues`,
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

        setMonthlyRevenues(data.monthlyRevenues);
      } catch (error) {
        console.error("Error fetching dashboard counts data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch dashboard counts",
        });
      } finally {
        setLoadingMonthlyRevenues(false);
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      fetchMonthlyRevenues();
    }
  }, [router, toast]);

  return {
    monthlyRevenues,
    loadingMonthlyRevenues,
  };
}
