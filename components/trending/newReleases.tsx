"use client";
import React, { useState } from "react";
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

import Image from "next/image";
import { User } from "@/types/types";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Link from "next/link";
import { updateStreamCount } from "@/routes/updateStreamCount";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { removeFromPlaylist } from "@/routes/removeFromPlaylist";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import { createPlaylist } from "@/routes/createPlaylist";
import { Loader, PlusCircle } from "lucide-react";
import PlaylistDialog from "@/components/playlist/playlistDialog";

interface Audio {
  id: string;
  user: User;
  title: string;
  category: string;
  coverImage: string;
  parts: AudioPart[];
}

interface AudioPart {
  audioUrl: string;
  partName: string;
}

interface Props {
  audioItem: Audio;
}

const NewReleases: React.FC<Props> = ({ audioItem }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
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

  const handleAudioSelect = () => {
    setAudioData(audioItem);
    setCurrentIndex(0);
    if (audioRef.current) {
      audioRef.current.src = audioItem.parts[0].audioUrl;
      audioRef.current.load();
      playPauseHandler();
    }
    updateStreamCount(audioItem.id as string, router, toast);
  };

  const handleRemoveFromPlaylist = async (playlistName: string) => {
    const removed = await removeFromPlaylist(
      audioItem.id,
      playlistName,
      router,
      toast
    );
    if (removed) {
      refreshPlaylists();
    }
  };

  if (!audioItem) {
    return null;
  }

  return (
    <>
      <div className="space-y-3">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              onClick={handleAudioSelect}
              className="overflow-hidden rounded-md cursor-pointer"
            >
              <Image
                src={audioItem.coverImage}
                alt={audioItem.title}
                width={150}
                height={150}
                objectFit="contain"
                className="transition-all hover:scale-105 aspect-square"
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            <ContextMenuSub>
              <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
              <ContextMenuSubContent className="w-48">
                <ContextMenuItem onClick={() => setDialogOpen(true)}>
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
                          audioItem.id,
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
                (audio) => audio.id === audioItem.id
              );
              if (audioExistsInPlaylist) {
                return (
                  <ContextMenuItem
                    key={playlist.id}
                    className="text-nowrap"
                    onClick={() => handleRemoveFromPlaylist(playlist.name)}
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
            onClick={handleAudioSelect}
            className="font-medium cursor-pointer hover:text-white/80 leading-none"
          >
            {audioItem.title}
          </h3>
          <Link href={`/${audioItem.category.toLowerCase()}s`}>
            <p className="text-xs text-muted-foreground hover:text-white/50">
              {audioItem.category}
            </p>
          </Link>
          <Link href={`/creators/${audioItem.user.id}`}>
            <p className="text-xs text-muted-foreground hover:text-white/50">
              {audioItem.user.name}
            </p>
          </Link>
        </div>
      </div>
      {dialogOpen && (
        <PlaylistDialog
          audioId={audioItem.id}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
        />
      )}
    </>
  );
};

export default NewReleases;
