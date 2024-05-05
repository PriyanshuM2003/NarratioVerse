import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Audio } from "@/types/types";

export default function GetUserAudioData(): {
  UserAudioBookData: Audio[] | null;
  UserPodcastData: Audio[] | null;
  loadingAudioData: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingAudioData, setLoadingAudioData] = useState<boolean>(true);
  const [UserAudioBookData, setUserAudioBookData] = useState<Audio[] | null>(
    null
  );
  const [UserPodcastData, setUserPodcastData] = useState<Audio[] | null>(null);

  useEffect(() => {
    const fetchUserAudioData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        setLoadingAudioData(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getuseraudios`,
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
        const audioBookCategory = data.userAudio.filter(
          (audiobook: any) => audiobook.category === "Audiobook"
        );
        const pocastCategory = data.userAudio.filter(
          (podcast: any) => podcast.category === "Podcast"
        );
        setUserAudioBookData(audioBookCategory);
        setUserPodcastData(pocastCategory);
      } catch (error) {
        console.error("Error fetching audio data:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch audio data",
        });
      } finally {
        setLoadingAudioData(false);
      }
    };

    fetchUserAudioData();
  }, [toast, router]);

  return { UserAudioBookData, UserPodcastData, loadingAudioData };
}
