"use client";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Audio, User } from "@/types/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React from "react";
import Image from "next/image";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Link from "next/link";
import { updateStreamCount } from "@/routes/updateStreamCount";

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
        const token = localStorage.getItem("token");
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

  const {
    setAudioData,
    setCurrentIndex,
    playPauseHandler,
    audioRef,
    currentIndex,
    isPlaying,
  } = useAudioPlayer();

  const handleAudioSelect = (audio: Audio, startIndex: number = 0) => {
    setAudioData(audio);
    setCurrentIndex(startIndex);
    if (audioRef.current) {
      const audioItem = audio.parts[startIndex];
      audioRef.current.src = audioItem.audioUrl;
      audioRef.current.load();
      playPauseHandler();
    }
    updateStreamCount(audio.id as string, router, toast);
  };

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {router.query.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px] h-7">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] h-7">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] h-7">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
                <div className="space-y-3 gap-4" key={audio.id}>
                  <ContextMenu>
                    <ContextMenuTrigger>
                      <div
                        onClick={() => handleAudioSelect(audio)}
                        className="overflow-hidden cursor-pointer rounded-md"
                      >
                        <Image
                          src={audio.coverImage}
                          alt={audio.title}
                          width={150}
                          height={150}
                          objectFit="contain"
                          className={cn(
                            "transition-all hover:scale-105 aspect-square"
                          )}
                        />
                      </div>
                    </ContextMenuTrigger>
                    {/* <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                  </svg>
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent> */}
                  </ContextMenu>
                  <div className="space-y-1 text-sm">
                    <h3
                      onClick={() => handleAudioSelect(audio)}
                      className="font-medium leading-none cursor-pointer hover:text-white/80"
                    >
                      {audio.title}
                    </h3>
                    <p
                      onClick={() => handleAudioSelect(audio)}
                      className="text-xs cursor-pointer text-muted-foreground hover:text-white/50"
                    >
                      {audio.category}
                    </p>
                    <Link href={`/creators/${audio.user.id}`}>
                      <p className="text-xs cursor-pointer text-muted-foreground hover:text-white/50">
                        {audio.user.name}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
