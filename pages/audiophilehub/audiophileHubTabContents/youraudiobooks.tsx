"use client";
import React, { useEffect, useState } from "react";
import GetUserAudiosData from "@/routes/getUserAudiosData";
import YourAudio from "@/components/common/YourAudio";

const YourAudiobooks = () => {
  const category = "Audiobook";
  const { loadingAudiosData, UserAudiosData } = GetUserAudiosData(category);
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  useEffect(() => {
    if (UserAudiosData) {
      setAudiobooks(UserAudiosData);
    }
  }, [UserAudiosData]);
  return (
    <>
      <YourAudio
        category={category}
        audios={audiobooks}
        section={"Audio Books"}
        loading={loadingAudiosData}
      />
    </>
  );
};

export default YourAudiobooks;
