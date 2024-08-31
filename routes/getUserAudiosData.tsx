import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Audio } from "@/types/types";
import { getAccessToken } from "@/lib/auth";
import { useRouter } from "next/router";

type UserAudioDataResult = {
  UserAudiosData: Audio[] | null;
  loadingAudiosData: boolean;
  refreshAudiosData: () => void;
};

export default function GetUserAudiosData(
  category: string
): UserAudioDataResult {
  const { toast } = useToast();
  const router = useRouter();
  const [loadingAudiosData, setLoadingAudiosData] = useState<boolean>(true);
  const apiUrl = `${process.env.NEXT_PUBLIC_HOST}/api/getuseraudios`;

  const fetcher = async (url: string) => {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
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
    return data.userAudios;
  };

  const { data, error } = useSWR(
    `${apiUrl}?category=${encodeURIComponent(category)}`,
    fetcher,
    {
      onSuccess: () => setLoadingAudiosData(false),
      onError: () => setLoadingAudiosData(false),
    }
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

  const refreshAudiosData = () => {
    setLoadingAudiosData(true);
    mutate(`${apiUrl}?category=${encodeURIComponent(category)}`);
  };

  return {
    UserAudiosData: data || null,
    loadingAudiosData,
    refreshAudiosData,
  };
}
