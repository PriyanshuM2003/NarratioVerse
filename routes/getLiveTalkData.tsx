import { useEffect } from "react";
import { LiveTalk } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import useSWR, { mutate } from "swr";
import { getAccessToken } from "@/lib/auth";

export default function GetLiveTalkData(): {
  liveTalkData: LiveTalk[] | null;
  loadingLiveTalkData: boolean;
  refreshLiveTalk: () => void;
} {
  const { toast } = useToast();

  const fetcher = async (url: string) => {
    const token = getAccessToken();
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
      throw new Error("Failed to fetch live talk data");
    }

    const data = await response.json();
    return data.userLiveTalk;
  };

  const {
    data: liveTalkData,
    error,
    isValidating: loadingLiveTalkData,
  } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/getlivetalk`, fetcher);

  useEffect(() => {
    if (error) {
      console.error("Error fetching live talk data:", error);
      toast({
        variant: "destructive",
        description: "Failed to fetch live talk data",
      });
    }
  }, [error, toast]);

  const refreshLiveTalk = () => {
    mutate(`${process.env.NEXT_PUBLIC_HOST}/api/getlivetalk`);
  };

  return { liveTalkData, loadingLiveTalkData, refreshLiveTalk };
}
