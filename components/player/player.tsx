"use client";
import React, { useEffect, useRef, useState } from "react";
import { useAudioPlayer } from "../../context/AudioPlayerContext";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  RotateCcw,
  Volume2,
  VolumeX,
  Volume1,
  Volume,
  Loader,
  List,
  AudioLines,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import Image from "next/image";

const Player: React.FC = () => {
  const {
    audioData,
    isPlaying,
    playPauseHandler,
    skipHandler,
    audioRef,
    currentIndex,
    handleVolumeChange,
    volume,
    setCurrentIndex,
    sliderRef,
  } = useAudioPlayer();

  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedPartIndex, setSelectedPartIndex] = useState<number>(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleEnded = () => {
    if (audioData && currentIndex === audioData.parts.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  
    playPauseHandler();
  };

  const handlePartClick = (partIndex: number) => {
    if (audioData && selectedPartIndex !== partIndex && audioData.parts[partIndex]) {
      setSelectedPartIndex(partIndex);
      setCurrentIndex(partIndex);
  
      if (audioRef.current) {
        setLoading(true);
        audioRef.current.src = audioData.parts[partIndex].audioUrl;
        audioRef.current.load();
        playPauseHandler();
      }
    }
  };

  const handleRestartClick = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentIndex(0);
    }
  };

  const handleMuteToggle = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = 1;
      } else {
        audioRef.current.volume = 0;
      }
    }

    setIsMuted((prevIsMuted) => !prevIsMuted);
  };

  useEffect(() => {
    const updateCurrentTime = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
        setDuration(audioRef.current.duration);

        const newProgress =
          (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(newProgress);
      }
    };

    const handleTimeUpdate = () => {
      updateCurrentTime();
    };

    const handleDurationChange = () => {
      updateCurrentTime();
    };

    const handleLoadedData = () => {
      setIsAudioLoaded(true);
      setLoading(false);
      if (!isPlaying && audioRef.current) {
        playPauseHandler();
      }
    };

    if (audioRef.current) {
      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      audioRef.current.addEventListener("durationchange", handleDurationChange);
      audioRef.current.addEventListener("loadeddata", handleLoadedData);
      audioRef.current.addEventListener("ended", handleEnded);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "durationchange",
          handleDurationChange
        );
        audioRef.current.removeEventListener("loadeddata", handleLoadedData);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [audioRef, currentIndex, isPlaying, playPauseHandler, skipHandler]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const progressBar = progressBarRef.current.getBoundingClientRect();
      const clickPosition = e.clientX - progressBar.left;
      const totalWidth = progressBar.width;
      const newProgress = (clickPosition / totalWidth) * 100;

      const clampedProgress = Math.max(0, Math.min(newProgress, 100));

      setProgress(clampedProgress);

      audioRef.current.currentTime =
        (clampedProgress / 100) * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    setSelectedPartIndex(currentIndex);
  }, [currentIndex]);

  useEffect(() => {
    if (audioData) {
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      setIsAudioLoaded(false);

      if (audioRef.current) {
        audioRef.current.src = audioData.parts[currentIndex].audioUrl;
        audioRef.current.load();
      }
    }
  }, [audioData, currentIndex, audioRef]);

  if (!audioData) {
    return null;
  }

  return (
    <>
      <div className="sticky bottom-5 flex items-center justify-between z-50 bg-gray-900 text-white p-4">
        <Drawer>
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 items-center">
              <Image
                width={16}
                height={16}
                src={audioData.coverImage}
                alt={audioData.title}
                className="w-16 h-16"
              />
              <div className="song-description">
                <p className="title text-lg overflow-hidden font-semibold overflow-ellipsis whitespace-nowrap max-w-xs">
                  {audioData.title}
                </p>
                <p className="partName text-sm text-pink-600 font-semibold overflow-hidden overflow-ellipsis whitespace-nowrap max-w-xs">
                  {audioData.parts[currentIndex].partName}
                </p>
                <p className="artist text-gray-400">{audioData.category}</p>
              </div>
            </div>
          </div>
          <div className="progress-controller flex flex-col items-center w-full space-y-4">
            <div className="control-buttons cursor-pointer flex items-center gap-8">
              <RotateCcw onClick={handleRestartClick} />
              <SkipBack onClick={() => skipHandler("backward")} />

              {loading ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  {isPlaying ? (
                    <Pause onClick={playPauseHandler} />
                  ) : (
                    <Play onClick={playPauseHandler} />
                  )}
                </>
              )}

              <SkipForward onClick={() => skipHandler("forward")} />
              <DrawerTrigger asChild>
                <List />
              </DrawerTrigger>
            </div>
            <div className="progress-container flex items-center cursor-pointer space-x-1 justify-center w-4/5">
              <span className="text-sm">{formatTime(currentTime)}</span>
              {isAudioLoaded && (
                <Progress
                  ref={progressBarRef}
                  onClick={handleProgressBarClick}
                  value={progress}
                />
              )}
              <span className="text-sm">{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="cursor-pointer flex items-center gap-4">
              {(isMuted ||
                (audioRef.current && audioRef.current.volume === 0)) && (
                <VolumeX onClick={handleMuteToggle} />
              )}
              {!isMuted && audioRef.current && (
                <>
                  {audioRef.current.volume > 0.7 && (
                    <Volume2 onClick={handleMuteToggle} />
                  )}
                  {audioRef.current.volume <= 0.7 &&
                    audioRef.current.volume > 0.3 && (
                      <Volume1 onClick={handleMuteToggle} />
                    )}
                  {audioRef.current.volume <= 0.3 &&
                    audioRef.current.volume > 0 && (
                      <Volume onClick={handleMuteToggle} />
                    )}
                </>
              )}
              <Slider
                ref={sliderRef}
                className="w-28"
                value={isMuted ? [0] : [volume * 100]}
                onValueChange={([newValue]) => handleVolumeChange(newValue)}
                step={1}
                max={100}
                min={0}
              />
            </div>
          </div>
          <audio
            ref={audioRef}
            src={audioData.parts[currentIndex].audioUrl}
            preload="metadata"
          />
          <DrawerContent>
            <div className="text-white px-4 w-full">
              <DrawerHeader>
                <DrawerTitle>
                  <DrawerDescription>{audioData.category}</DrawerDescription>
                  {audioData.title}
                </DrawerTitle>
                <DrawerDescription>Parts</DrawerDescription>
              </DrawerHeader>
              <DrawerClose asChild>
                <ul className="space-y-2 mb-4 cursor-pointer">
                  {audioData.parts.map((part, index) => (
                    <li
                      key={index}
                      className={`flex items-center justify-between ${
                        index === selectedPartIndex ? "active" : ""
                      }`}
                      onClick={() => handlePartClick(index)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{index + 1}.</span>
                        <div
                          className={`hover:underline cursor-pointer ${
                            index === selectedPartIndex
                              ? "text-pink-600 font-semibold"
                              : ""
                          }`}
                        >
                          {part.partName}
                        </div>
                      </div>
                      {index === selectedPartIndex && (
                        <AudioLines className="animate-pulse text-pink-600" />
                      )}
                    </li>
                  ))}
                </ul>
              </DrawerClose>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </>
  );
};

const formatTime = (time: number): string => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Player;
