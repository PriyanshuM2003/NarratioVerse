import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import PlaylistDialog from "../dialogs/playlistDialog";
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
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/router";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import { createPlaylist } from "@/routes/createPlaylist";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { updateStreamCount } from "@/routes/updateStreamCount";
import { removeFromPlaylist } from "@/routes/removeFromPlaylist";
import { Skeleton } from "../ui/skeleton";
import AboutDialog from "../dialogs/aboutDialog";

const AudioCover = ({ audioItem }: any) => {
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [loadingDuration, setLoadingDuration] = useState(true);
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

  useEffect(() => {
    const calculateTotalDuration = () => {
      let total = 0;

      audioItem.parts.forEach((part: any, index: number) => {
        const audio = new Audio(part.audioUrl);
        audio.onloadedmetadata = () => {
          total += audio.duration;
          setTotalDuration(total);
          if (index === audioItem.parts.length - 1) {
            setLoadingDuration(false);
          }
        };
      });
    };

    calculateTotalDuration();
  }, [audioItem.parts]);

  const formattedDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);

    if (minutes > 0) {
      return `${minutes} min ${seconds.toString().padStart(2, "0")} sec`;
    } else {
      return `${seconds} sec`;
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
              {loadingDuration ? (
                <Skeleton className="w-16 h-3 absolute bottom-1 right-2" />
              ) : (
                <div className="absolute bottom-1 right-2 left-2 flex items-center justify-between">
                  <Badge
                    onClick={(e) => {
                      e.stopPropagation();
                      setAboutDialogOpen(true);
                    }}
                    className=""
                  >
                    About
                  </Badge>
                  <Badge className="ml-auto">
                    {formattedDuration(totalDuration)}
                  </Badge>
                </div>
              )}
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
                  playlistsData
                    ?.filter((playlist) => {
                      return !playlist.audios.some(
                        (audio) => audio.id === audioItem.id
                      );
                    })
                    .map((playlist) => (
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
      {aboutDialogOpen && (
        <AboutDialog
          audioAbout={audioItem.about}
          audioTitle={audioItem.title}
          setAboutDialogOpen={setAboutDialogOpen}
          aboutDialogOpen={aboutDialogOpen}
        />
      )}
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
