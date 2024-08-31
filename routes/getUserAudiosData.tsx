import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Audio } from "@/types/types";
import { getAccessToken } from "@/lib/auth";

type UserAudioDataResult = {
  UserAudiosData: Audio[] | null;
  loadingAudiosData: boolean;
  refreshAudiosData: () => void;
};

export default function GetUserAudiosData(
  category: string
): UserAudioDataResult {
  const router = useRouter();
  const { toast } = useToast();

  const fetcher = async (url: string) => {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Token not available");
    }

    const response = await fetch(
      `${url}?category=${encodeURIComponent(category)}`,
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
    return data.userAudios;
  };

  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_HOST}/api/getuseraudios`,
    fetcher
  );

  useEffect(() => {
    if (error) {
      console.error("Error fetching audio data:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch audio data",
      });
    }
  }, [error, toast]);

  const loadingAudiosData = !data && !error;

  const refreshAudiosData = () => {
    mutate(
      `${
        process.env.NEXT_PUBLIC_HOST
      }/api/getuseraudios?category=${encodeURIComponent(category)}`
    );
  };

  return {
    UserAudiosData: data || null,
    loadingAudiosData,
    refreshAudiosData,
  };
}
