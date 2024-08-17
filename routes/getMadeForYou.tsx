import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Preferences } from "@/types/types";
import useSWR from "swr";
import { getAccessToken } from "@/lib/auth";

export default function GetMadeForYou(): {
  madeForYouData: Preferences[] | null;
  loadingmadeforyou: boolean;
  refreshMadeForYou: () => void;
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
      throw new Error("Failed to fetch audio data");
    }

    const data = await response.json();
    return {
      madeForYouData: data.madeForYouData,
    };
  };

  const {
    data,
    error,
    isValidating: loadingmadeforyou,
    mutate: swrMutate,
  } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/getmadeforyou`, fetcher);

  const refreshMadeForYou = () => {
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
    madeForYouData: data?.madeForYouData || null,
    loadingmadeforyou: !data && !error,
    refreshMadeForYou,
  };
}
