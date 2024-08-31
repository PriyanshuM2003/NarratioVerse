"use client";
import React, { useEffect, useState } from "react";
import GetUserAudiosData from "@/routes/getUserAudiosData";
import YourAudio from "@/components/common/YourAudio";

const YourPodcasts = () => {
  const category = "Podcast";
  const { UserAudiosData, loadingAudiosData } = GetUserAudiosData(category);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  useEffect(() => {
    if (UserAudiosData) {
      setPodcasts(UserAudiosData);
    }
  }, [UserAudiosData]);

  return (
    <>
      <YourAudio
        category={category}
        audios={podcasts}
        section={"Podcasts"}
        loading={loadingAudiosData}
      />
    </>
  );
};

export default YourPodcasts;
