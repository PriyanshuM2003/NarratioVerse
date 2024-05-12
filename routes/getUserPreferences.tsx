import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Preferences } from "@/types/types";
import useSWR, { mutate } from "swr";

export default function GetUserPreferences(): {
  userPreferenceData: Preferences | null;
  madeForYouData: Preferences[] | null;
  loadingPreferencesData: boolean;
  refreshPreferences: () => void;
} {
  const router = useRouter();
  const { toast } = useToast();

  const fetcher = async (url: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Token not available");
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audio data");
    }

    const data = await response.json();
    return {
      userPreferenceData: data.userPreferences,
      madeForYouData: data.madeForYouData,
    };
  };

  const {
    data,
    error,
    isValidating: loadingPreferencesData,
    mutate: swrMutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/getuserpreferences`, fetcher);

  const refreshPreferences = () => {
    swrMutate();
  };

  useEffect(() => {
    if (error) {
      console.error("Error fetching audio data:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch audio data",
      });
    }
  }, [error, toast]);

  return {
    userPreferenceData: data?.userPreferenceData || null,
    madeForYouData: data?.madeForYouData || null,
    loadingPreferencesData: !data && !error,
    refreshPreferences,
  };
}
