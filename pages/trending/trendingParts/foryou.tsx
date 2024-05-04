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
import { User } from "@/types/trendingTypes";

interface AudioForYou {
  user: User;
  title: string;
  category: string;
  coverImage: string;
}

interface Props {
  audioItem: AudioForYou;
}

const AudioMadeForYou: React.FC<Props> = ({ audioItem }) => {
  if (!audioItem) {
    return null;
  }

  return (
    <div className="space-y-3">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden rounded-md">
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
        <h3 className="font-medium leading-none">{audioItem.title}</h3>
        <p className="text-xs text-muted-foreground">{audioItem.category}</p>
        <p className="text-xs text-muted-foreground">{audioItem.user.name}</p>
      </div>
    </div>
  );
};

export default AudioMadeForYou;
