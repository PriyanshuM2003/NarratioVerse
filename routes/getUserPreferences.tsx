import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Preferences } from "@/types/types";

export default function GetUserPreferences(): {
  userPreferenceData: Preferences | null;
  madeForYouData: Preferences[] | null;
  loadingPreferencesData: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingPreferencesData, setLoadingPreferencesData] =
    useState<boolean>(true);
  const [userPreferenceData, setUserPreferenceData] =
    useState<Preferences | null>(null);
  const [madeForYouData, setMadeForYouData] = useState<Preferences[] | null>(
    null
  );

  useEffect(() => {
    const fetchUserPreferenceData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        setLoadingPreferencesData(true);
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
        setMadeForYouData(data.madeForYouData);
      } catch (error) {
        console.error("Error fetching audio data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch audio data",
        });
      } finally {
        setLoadingPreferencesData(false);
      }
    };

    fetchUserPreferenceData();
  }, [toast, router]);

  return { userPreferenceData, madeForYouData, loadingPreferencesData };
}
