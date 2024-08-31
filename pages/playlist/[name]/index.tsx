"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Audio, User } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { getAccessToken } from "@/lib/auth";
import AudioCover from "@/components/common/AudioCover";
import Filter from "@/components/common/Filter";

interface PlaylistAudio {
  user: User;
  audios: Audio[];
}

interface PlaylistData {
  playlistAudios: PlaylistAudio | null;
}

export default function Playlist() {
  const router = useRouter();
  const { toast } = useToast();
  const [playlistAudios, setPlaylistAudios] =
    useState<PlaylistData["playlistAudios"]>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylistAudios = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          router.push("/login");
          return;
        }
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getplaylistaudios?name=${router.query.name}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setPlaylistAudios(data.playlistAudios);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        toast({
          variant: "destructive",
          description: `${err.message}`,
        });
      }
    };

    if (router.query.name) {
      fetchPlaylistAudios();
    }
  }, [router.query.name]);

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {router.query.name}
            </h2>
          </div>
          <Filter />
        </div>
        <Separator className="my-4" />
        {loading ? (
          <>
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: 32 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="h-[150px] w-[150px] bg-gray-300 rounded-md"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-4 flex-wrap">
              {playlistAudios?.audios.map((audio) => (
                <AudioCover key={audio.id} audioItem={audio} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
