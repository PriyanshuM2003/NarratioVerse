"use client";
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
import React, { useState } from "react";
import prisma from "@/lib/prisma";
import Image from "next/image";
import { User } from "@/types/types";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { updateStreamCount } from "@/routes/updateStreamCount";
import { useToast } from "@/components/ui/use-toast";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import { removeFromPlaylist } from "@/routes/removeFromPlaylist";
import { createPlaylist } from "@/routes/createPlaylist";
import { Loader, PlusCircle } from "lucide-react";
import PlaylistDialog from "@/components/playlist/playlistDialog";

interface Audio {
  user: User;
  id: string;
  parts: AudioPart[];
  coverImage: string;
  title: string;
  category: string;
}

interface AudioPart {
  audioUrl: string;
  partName: string;
}

const AudioBooks = ({ audio }: { audio: Audio[] }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const { playlistsData, loadingPlaylistsData, refreshPlaylists } =
    GetPlaylistsData();

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

  const handleRemoveFromPlaylist = async (
    playlistName: string,
    audioId: string
  ) => {
    const removed = await removeFromPlaylist(
      audioId,
      playlistName,
      router,
      toast
    );
    if (removed) {
      refreshPlaylists();
    }
  };

  if (!audio) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Audio Books
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
        <div className="flex items-center gap-4 flex-wrap">
          {audio.map((audioBook) => (
            <div className="space-y-3 gap-4" key={audioBook.id}>
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    onClick={() => handleAudioSelect(audioBook)}
                    className="overflow-hidden cursor-pointer rounded-md"
                  >
                    <Image
                      src={audioBook.coverImage}
                      alt={audioBook.title}
                      width={150}
                      height={150}
                      objectFit="contain"
                      className={cn(
                        "transition-all hover:scale-105 aspect-square"
                      )}
                    />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent className="w-40">
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      Add to Playlist
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent className="w-48">
                      <ContextMenuItem
                        onClick={() => {
                          setDialogOpen(true);
                          setSelectedAudioId(audioBook.id);
                        }}
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Playlist
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      {loadingPlaylistsData ? (
                        <Loader className="animate-spin flex mx-auto my-4" />
                      ) : (
                        playlistsData?.map((playlist) => (
                          <ContextMenuItem
                            key={playlist.id}
                            onClick={async () => {
                              await createPlaylist(
                                audioBook.id,
                                playlist.name,
                                router,
                                toast
                              );

                              refreshPlaylists();
                            }}
                          >
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
                            {playlist.name}
                          </ContextMenuItem>
                        ))
                      )}
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSeparator />
                  {playlistsData?.map((playlist) => {
                    const audioExistsInPlaylist = playlist.audios.some(
                      (audio) => audio.id === audioBook.id
                    );
                    if (audioExistsInPlaylist) {
                      return (
                        <ContextMenuItem
                          key={playlist.id}
                          className="text-nowrap"
                          onClick={() =>
                            handleRemoveFromPlaylist(
                              playlist.name,
                              audioBook.id
                            )
                          }
                        >
                          Remove from {playlist.name}
                        </ContextMenuItem>
                      );
                    }
                    return null;
                  })}

                  {/* <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem> */}
                </ContextMenuContent>
              </ContextMenu>
              <div className="space-y-1 text-sm">
                <h3
                  onClick={() => handleAudioSelect(audioBook)}
                  className="font-medium leading-none cursor-pointer hover:text-white/80"
                >
                  {audioBook.title}
                </h3>
                <p
                  onClick={() => handleAudioSelect(audioBook)}
                  className="text-xs cursor-pointer text-muted-foreground hover:text-white/50"
                >
                  {audioBook.category}
                </p>
                <Link href={`/creators/${audioBook.user.id}`}>
                  <p className="text-xs cursor-pointer text-muted-foreground hover:text-white/50">
                    {audioBook.user.name}
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      {dialogOpen && (
        <PlaylistDialog
          audioId={selectedAudioId || ""}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
        />
      )}
    </>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const audio = await prisma.audio.findMany({
      where: {
        category: "Audiobook",
      },
      include: {
        user: true,
      },
    });

    const formattedAudio = audio.map((audioItem) => ({
      ...audioItem,
      createdAt: audioItem.createdAt.toISOString(),
      updatedAt: audioItem.updatedAt.toISOString(),
      expiryDate: audioItem.user.expiryDate
        ? audioItem.user.expiryDate.toISOString()
        : null,
      user: {
        ...audioItem.user,
        createdAt: audioItem.user.createdAt.toISOString(),
        updatedAt: audioItem.user.updatedAt.toISOString(),
        expiryDate: audioItem.user.expiryDate
          ? audioItem.user.expiryDate.toISOString()
          : null,
      },
    }));

    return {
      props: {
        audio: formattedAudio,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        audio: [],
      },
    };
  }
}

export default AudioBooks;
