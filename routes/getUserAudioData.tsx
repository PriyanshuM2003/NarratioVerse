import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR, { mutate } from "swr";
import { Audio } from "@/types/types";
import { getAccessToken } from "@/lib/auth";

export default function GetUserAudioData(): {
  UserAudioBookData: Audio[] | null;
  UserPodcastData: Audio[] | null;
  loadingAudioData: boolean;
  refreshAudioData: () => void;
} {
  const router = useRouter();
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
    const audioBookCategory = data.userAudio.filter(
      (audiobook: any) => audiobook.category === "Audiobook"
    );
    const podcastCategory = data.userAudio.filter(
      (podcast: any) => podcast.category === "Podcast"
    );
    return { audioBookCategory, podcastCategory };
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

  const { audioBookCategory, podcastCategory } = data || {};
  const loadingAudioData = !data && !error;

  const refreshAudioData = () => {
    mutate(`${process.env.NEXT_PUBLIC_HOST}/api/getuseraudios`);
  };

  return {
    UserAudioBookData: audioBookCategory,
    UserPodcastData: podcastCategory,
    loadingAudioData,
    refreshAudioData,
  };
}
