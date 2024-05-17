import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Preferences } from "@/types/types";

export default function GetUserPlanData(): {
  userPlanData: Preferences | null;
  loadingUserPlanData: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingUserPlanData, setLoadingUserPlanData] = useState<boolean>(true);
  const [userPlanData, setUserPlanData] = useState<Preferences | null>(null);

  useEffect(() => {
    const fetchUserPreferenceData = async () => {
      try {
        setLoadingUserPlanData(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getplandata`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch audio data");
        }

        const data = await response.json();

        setUserPlanData(data.planData);
      } catch (error) {
        console.error("Error fetching user preferences data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch your preferences",
        });
      } finally {
        setLoadingUserPlanData(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserPreferenceData();
    }
  }, [router, toast]);
  return { userPlanData, loadingUserPlanData };
}
