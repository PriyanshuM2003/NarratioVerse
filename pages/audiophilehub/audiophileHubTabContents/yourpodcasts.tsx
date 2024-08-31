"use client";
import React, { useEffect, useState } from "react";
import GetUserAudiosData from "@/routes/getUserAudiosData";
import YourAudio from "@/components/common/YourAudio";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const YourPodcasts = () => {
  const { UserAudiosData, loadingAudiosData } = GetUserAudiosData("Podcast");
  const [podcasts, setPodcasts] = useState<any[]>([]);
  useEffect(() => {
    if (UserAudiosData) {
      setPodcasts(UserAudiosData);
    }
  }, [UserAudiosData]);

  return (
    <>
      <div className="min-h-screen px-8 pb-4 text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Podcasts
          </h2>
        </div>
        <Separator className="my-4" />
        {loadingAudiosData ? (
          Array.from({ length: 10 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-full bg-gray-300 mb-4 rounded-md"
            />
          ))
        ) : (
          <YourAudio audios={podcasts} />
        )}
      </div>
    </>
  );
};

export default YourPodcasts;
