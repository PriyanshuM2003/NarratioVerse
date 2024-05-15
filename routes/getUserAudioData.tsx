import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Audio } from "@/types/types";
import useSWR from "swr";

export default function GetUserAudioData(): {
  UserAudioBookData: Audio[] | null;
  UserPodcastData: Audio[] | null;
  loadingAudioData: boolean;
  refreshAudioData: () => void;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingAudioData, setLoadingAudioData] = useState<boolean>(true);

  const token = localStorage.getItem("token");
  const {
    data: userData,
    error: audioError,
    mutate: mutateAudio,
  } = useSWR(
    token ? `${process.env.NEXT_PUBLIC_HOST}/api/getuseraudios` : null,
    async (url) => {
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
      return response.json();
    }
  );

  useEffect(() => {
    if (audioError) {
      console.error("Error fetching audio data:", audioError);
      toast({
        variant: "destructive",
        description: "Failed to fetch audio data",
      });
    }
    setLoadingAudioData(!userData && !audioError);
  }, [audioError, toast, userData]);

  const UserAudioBookData = userData
    ? userData.userAudio.filter(
        (audiobook: any) => audiobook.category === "Audiobook"
      )
    : null;
  const UserPodcastData = userData
    ? userData.userAudio.filter(
        (podcast: any) => podcast.category === "Podcast"
      )
    : null;

  const refreshAudioData = () => {
    mutateAudio();
  };

  return {
    UserAudioBookData,
    refreshAudioData,
    UserPodcastData,
    loadingAudioData,
  };
}
