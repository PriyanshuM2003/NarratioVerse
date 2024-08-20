"use client";
import React, { useEffect, useState } from "react";
import GetUserAudioData from "@/routes/getUserAudioData";
import YourAudio from "@/components/common/YourAudio";

const YourAudiobooks = () => {
  const { loadingAudioData, UserAudioBookData } = GetUserAudioData();
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  useEffect(() => {
    if (UserAudioBookData) {
      setAudiobooks(UserAudioBookData);
    }
  }, [UserAudioBookData]);
  return (
    <>
      <YourAudio
        audios={audiobooks}
        section={"Audio Books"}
        loading={loadingAudioData}
      />
    </>
  );
};

export default YourAudiobooks;
