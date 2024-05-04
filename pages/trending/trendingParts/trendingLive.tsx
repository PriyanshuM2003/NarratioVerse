"use client";
import React from "react";
import { Radio } from "lucide-react";
import Image from "next/image";
import { User } from "@/types/trendingTypes";
import Link from "next/link";

interface LiveTalk {
  user: User;
  title: string;
  status: boolean;
  genres: string[];
  profileImage?: string;
  roomId: string;
}

interface Props {
  liveItem: LiveTalk;
}

const TrendingLive: React.FC<Props> = ({ liveItem }) => {
  if (!liveItem?.status) {
    return null;
  }
  return (
    <div className="space-y-3">
      <Link href={`/live/${liveItem.roomId}`}>
        <div className="relative">
          <Image
            src={liveItem.user.profileImage || ""}
            alt={liveItem.title}
            width={150}
            height={150}
            objectFit="contain"
            className="rounded-full aspect-square relative border-4 border-red-600"
          />
          <div className="bg-white absolute -bottom-2 left-1/2 px-1 rounded-3xl transform -translate-x-1/2">
            <Radio className="animate-pulse text-red-600" />
          </div>
        </div>
      </Link>
      <div className="space-y-1 text-sm text-center">
        <p className="text-xs text-muted-foreground">{liveItem.user.name}</p>
        <Link href={`/live/${liveItem.roomId}`}>
          <p className="font-medium leading-none">{liveItem.title}</p>
        </Link>
      </div>
    </div>
  );
};

export default TrendingLive;
