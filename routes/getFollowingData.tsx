import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Follower } from "@/types/types";

export default function GetFollowingData(): {
  followingData: Follower | null;
  loadingFollowingData: boolean;
  setLoadingFollowingData: React.Dispatch<React.SetStateAction<boolean>>;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingFollowingData, setLoadingFollowingData] =
    useState<boolean>(true);
  const [followingData, setFollowingData] = useState<Follower | null>(null);

  useEffect(() => {
    const fetchFollowingeData = async () => {
      try {
        setLoadingFollowingData(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getfollowing`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch following data");
        }

        const data = await response.json();

        setFollowingData(data.followingData);
      } catch (error) {
        console.error("Error fetching following data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch following data",
        });
      } finally {
        setLoadingFollowingData(false);
      }
    };
    const token = localStorage.getItem("token");
    if (token) {
      fetchFollowingeData();
    }
  }, [router, toast]);

  return { followingData, loadingFollowingData, setLoadingFollowingData };
}
