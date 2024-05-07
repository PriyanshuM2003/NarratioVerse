"use client";
import React from "react";
import { PlusCircle } from "lucide-react";
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

import Image from "next/image";
import { playlists } from "@/data/playlists";
import { User } from "@/types/types";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Link from "next/link";

interface AudioForYou {
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
  audioItem: AudioForYou;
}

const AudioMadeForYou: React.FC<Props> = ({ audioItem }) => {
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
  };

  if (!audioItem) {
    return null;
  }

  return (
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
              className="transition-all aspect-square hover:scale-105"
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
  );
};

export default AudioMadeForYou;
