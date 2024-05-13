import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Preferences } from "@/types/types";

export default function GetUserPreferences(): {
  userPreferenceData: Preferences | null;
  loadingUserPreferences: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingUserPreferences, setLoadingUserPreferences] =
    useState<boolean>(true);
  const [userPreferenceData, setUserPreferenceData] =
    useState<Preferences | null>(null);

  useEffect(() => {
    const fetchUserPreferenceData = async () => {
      try {
        setLoadingUserPreferences(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getuserpreferences`,
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

        setUserPreferenceData(data.userPreferences);
      } catch (error) {
        console.error("Error fetching user preferences data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch your preferences",
        });
      } finally {
        setLoadingUserPreferences(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchUserPreferenceData();
    }
  }, [router, toast]);
  return { userPreferenceData, loadingUserPreferences };
}
