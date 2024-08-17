import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { addFollow } from "@/routes/addFollow";
import { removeFollowing } from "@/routes/removeFollowing";
import GetFollowingData from "@/routes/getFollowingData";

export default function useFollowHandler() {
  const [isFollowing, setIsFollowing] = useState<any | null>(null);
  const { followingData, loadingFollowingData, setLoadingFollowingData } =
    GetFollowingData();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (followingData) {
      setIsFollowing(followingData);
    }
  }, [followingData]);

  const handleFollow = async (creatorId: string) => {
    try {
      setLoadingFollowingData(true);
      await addFollow(creatorId, router, toast);
      setIsFollowing((prevFollowingData: any) => ({
        ...prevFollowingData,
        followedId: prevFollowingData?.followedId
          ? [...prevFollowingData.followedId, creatorId]
          : [creatorId],
      }));
    } catch (error) {
      console.error("Error following creator:", error);
    } finally {
      setLoadingFollowingData(false);
    }
  };

  const handleUnfollow = async (creatorId: string) => {
    try {
      setLoadingFollowingData(true);
      await removeFollowing(creatorId, router, toast);
      setIsFollowing((prevFollowingData: any) => ({
        ...prevFollowingData,
        followedId:
          prevFollowingData.followedId.filter(
            (id: string) => id !== creatorId
          ) || [],
      }));
    } catch (error) {
      console.error("Error unfollowing creator:", error);
    } finally {
      setLoadingFollowingData(false);
    }
  };

  return {
    isFollowing,
    loadingFollowingData,
    handleFollow,
    handleUnfollow,
  };
}
