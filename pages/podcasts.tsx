"use client";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import prisma from "@/lib/prisma";
import { User } from "@/types/types";
import AudioCover from "@/components/common/AudioCover";
import Filter from "@/components/common/Filter";

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

const Podcasts = ({ audio }: { audio: Audio[] }) => {
  if (!audio) {
    return (
      <>
        <div className="text-xl text-white text-center my-8">
          No Podcasts Available!!
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Podcasts</h2>
          </div>
          <Filter />
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-4 flex-wrap">
          {audio.map((podcast) => (
            <AudioCover key={podcast.id} audioItem={podcast} />
          ))}
          <div className="flex items-center gap-4 flex-wrap"></div>
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const audio = await prisma.audio.findMany({
      where: {
        category: "Podcast",
      },
      include: {
        user: true,
      },
    });

    const formattedAudio = audio.map((audioItem) => ({
      ...audioItem,
      createdAt: audioItem.createdAt.toISOString(),
      updatedAt: audioItem.updatedAt.toISOString(),

      user: {
        ...audioItem.user,
        createdAt: audioItem.user.createdAt.toISOString(),
        updatedAt: audioItem.user.updatedAt.toISOString(),
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

export default Podcasts;
