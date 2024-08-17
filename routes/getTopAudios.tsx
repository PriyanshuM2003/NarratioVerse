import { useToast } from "@/components/ui/use-toast";
import { getAccessToken } from "@/lib/auth";
import { Audio } from "@/types/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function GetTopAudios(): {
  topAudios: Audio[] | null;
  loadingTopAudios: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingTopAudios, setLoadingTopAudios] = useState<boolean>(true);

  const [topAudios, setTopAudios] = useState<Audio[] | null>(null);

  useEffect(() => {
    const fetchTopAudios = async () => {
      try {
        setLoadingTopAudios(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/gettopaudios`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch top audios");
        }

        const data = await response.json();

        setTopAudios(data.topAudios);
      } catch (error) {
        console.error("Error fetching top audios:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch top audios",
        });
      } finally {
        setLoadingTopAudios(false);
      }
    };
    const token = getAccessToken();
    if (token) {
        fetchTopAudios();
    }
  }, [router, toast]);

  return {
    topAudios,
    loadingTopAudios,
  };
}
