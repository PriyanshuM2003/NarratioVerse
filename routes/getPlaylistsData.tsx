import useSWR, { mutate } from "swr";
import { Playlist } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { getAccessToken } from "@/lib/auth";

export default function GetPlaylistsData(): {
  playlistsData: Playlist[] | null;
  loadingPlaylistsData: boolean;
  refreshPlaylists: () => void;
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
      throw new Error("Failed to fetch following data");
    }

    const data = await response.json();
    return data.playlists;
  };

  const {
    data: playlistsData,
    error,
    isValidating: loadingPlaylistsData,
  } = useSWR(`${process.env.NEXT_PUBLIC_HOST}/api/getplaylists`, fetcher);

  useEffect(() => {
    if (error) {
      console.error("Error fetching playlists data:", error);
      // toast({
      //   variant: "destructive",
      //   description: "Failed to fetch playlists data",
      // });
    }
  }, [error, toast]);
  const refreshPlaylists = () => {
    mutate(`${process.env.NEXT_PUBLIC_HOST}/api/getplaylists`);
  };

  return { playlistsData, loadingPlaylistsData, refreshPlaylists };
}
