"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export default function Player() {
  const router = useRouter();
  const { slug } = router.query;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);


  const playPauseHandler = () => {
    setIsPlaying(!isPlaying);
  };

  const skipHandler = (direction) => {
    if (direction === "forward") {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
    } else {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + songs.length) % songs.length
      );
    }
  };

  return (
    <>
      <div className="w-full sticky bottom-0 z-50 mx-auto p-4 bg-gray-100 shadow-md">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Title</h2>
          <p className="text-sm text-gray-600">Artist</p>
        </div>
        <div className="flex justify-center items-center mb-4">
          <SkipBack
            onClick={() => skipHandler("backward")}
            className="h-8 w-8 cursor-pointer"
          />
          {isPlaying ? (
            <Pause
              onClick={playPauseHandler}
              className="h-12 w-12 cursor-pointer text-blue-500"
            />
          ) : (
            <Play
              onClick={playPauseHandler}
              className="h-12 w-12 cursor-pointer text-blue-500"
            />
          )}
          <SkipForward
            onClick={() => skipHandler("forward")}
            className="h-8 w-8 cursor-pointer"
          />
        </div>
        <audio controls src="" className="w-full"></audio>
      </div>
    </>
  );
}
