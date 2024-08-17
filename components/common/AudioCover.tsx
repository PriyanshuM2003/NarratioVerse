import Image from "next/image";
import React, { useState } from "react";
import { Badge } from "../ui/badge";
import PlaylistDialog from "../playlist/playlistDialog";
import Link from "next/link";
import { Loader, PlusCircle } from "lucide-react";
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
import useFormatDuration from "@/hooks/useFormattedDuration";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/router";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import { createPlaylist } from "@/routes/createPlaylist";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { updateStreamCount } from "@/routes/updateStreamCount";
import { removeFromPlaylist } from "@/routes/removeFromPlaylist";

const AudioCover = ({ audioItem }: any) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { Duration } = useFormatDuration(audioItem.parts);
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
    return (
      <>
        <div className="text-xl text-white text-center my-8">
          No Audio Books Available!!
        </div>
      </>
    );
  }
  return (
    <>
      <div className="space-y-3">
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              onClick={handleAudioSelect}
              className="relative overflow-hidden rounded-md cursor-pointer"
            >
              <Image
                src={audioItem.coverImage}
                alt={audioItem.title}
                width={150}
                height={150}
                className="transition-all object-cover aspect-square hover:scale-105"
              />
              <Badge className="absolute bottom-1 right-2">{Duration}</Badge>
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
            className="font-medium truncate w-[9.375rem] cursor-pointer hover:text-white/80 leading-none"
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

export default AudioCover;
