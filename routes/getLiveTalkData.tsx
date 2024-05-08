import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LiveTalk } from "@/types/types";

export default function GetLiveTalkData(): {
  liveTalkData: LiveTalk | null;
  liveTalkHistoryData: LiveTalk[] | null;
  loadingLiveTalkData: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingLiveTalkData, setLoadingLiveTalkData] = useState<boolean>(true);
  const [liveTalkData, setLiveTalkData] = useState<LiveTalk | null>(null);
  const [liveTalkHistoryData, setLiveTalkHistoryData] = useState<
    LiveTalk[] | null
  >(null);

  useEffect(() => {
    const fetchLiveTalkData = async () => {
      try {
        setLoadingLiveTalkData(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getlivetalk`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch live talk data");
        }

        const data = await response.json();
        setLiveTalkData(data.userLiveTalk);
        setLiveTalkHistoryData(data.userLiveTalk);
      } catch (error) {
        console.error("Error fetching live talk data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch live talk data",
        });
      } finally {
        setLoadingLiveTalkData(false);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      fetchLiveTalkData();
    }
  }, [router, toast]);

  return { liveTalkData, liveTalkHistoryData, loadingLiveTalkData };
}
