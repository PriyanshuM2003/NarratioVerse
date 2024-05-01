"use client";
import React from "react";
import { Radio } from "lucide-react";
import { cn } from "@/lib/utils";
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
  aspectRatio?: "portrait" | "square";
  width: number;
  height: number;
  className?: string;
}

const TrendingLive: React.FC<Props> = ({
  liveItem,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}) => {
  if (!liveItem.status) {
    return null;
  }
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Link href={`/live/${liveItem.roomId}`}>
        <div className="relative">
          <Image
            src={liveItem.user.profileImage || ""}
            alt={liveItem.title}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover rounded-full relative border-4 border-red-600",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
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
