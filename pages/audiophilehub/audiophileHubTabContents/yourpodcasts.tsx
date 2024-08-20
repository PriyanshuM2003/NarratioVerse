"use client";
import React, { useEffect, useState } from "react";
import GetUserAudioData from "@/routes/getUserAudioData";
import YourAudio from "@/components/common/YourAudio";

const YourPodcasts = () => {
  const { UserPodcastData, loadingAudioData } = GetUserAudioData();
  const [podcasts, setPodcasts] = useState<any[]>([]);
  useEffect(() => {
    if (UserPodcastData) {
      setPodcasts(UserPodcastData);
    }
  }, [UserPodcastData]);

  return (
    <>
      <YourAudio
        audios={podcasts}
        section={"Podcasts"}
        loading={loadingAudioData}
      />
    </>
  );
};

export default YourPodcasts;
