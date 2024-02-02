"use client";
import React, { useEffect, useState } from "react";
import { useAudioPlayer } from "./AudioPlayerContext";
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
} from "lucide-react";

const Player = () => {
  const {
    audioData,
    isPlaying,
    playPauseHandler,
    skipHandler,
    audioRef,
    currentIndex,
    handleVolumeChange,
    setCurrentIndex,
  } = useAudioPlayer();

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const handleEnded = () => {
    if (currentIndex === audioData.parts.length - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }

    playPauseHandler();
  };

  const handleRestartClick = () => {
    audioRef.current.currentTime = 0;
    setCurrentIndex((prevIndex) => prevIndex);
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
      if (!isPlaying) {
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

  const handleProgressBarClick = (e) => {
    const progressBar = e.target.getBoundingClientRect();
    const clickPosition = e.clientX - progressBar.left;
    const totalWidth = progressBar.width;
    const newProgress = (clickPosition / totalWidth) * 100;
    setProgress(newProgress);

    if (audioRef.current) {
      audioRef.current.currentTime =
        (newProgress / 100) * audioRef.current.duration;
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  useEffect(() => {
    if (audioData) {
      setProgress(0);
      setCurrentTime(0);
      setDuration(0);
      setIsAudioLoaded(false);

      audioRef.current.src = audioData.parts[currentIndex].audioUrl;
      audioRef.current.load();
    }
  }, [audioData, currentIndex, audioRef]);

  if (!audioData) {
    return null;
  }

  return (
    <>
      <div className="music-player sticky bottom-0 flex items-center justify-between z-50 bg-gray-900 text-white p-4">
        <div className="song-bar flex items-center justify-between">
          <div className="song-infos flex space-x-2 items-center">
            <div className="image-container flex-shrink-0 w-16 h-16">
              <img
                src={audioData.coverImage}
                alt={audioData.title}
                className="w-full h-full object-cover"
              />
            </div>
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
            <SkipBack onClick={() => skipHandler("backward")} />
            {isPlaying ? (
              <Pause onClick={playPauseHandler} />
            ) : (
              <Play onClick={playPauseHandler} />
            )}
            <SkipForward onClick={() => skipHandler("forward")} />
            <RotateCcw onClick={handleRestartClick} />
          </div>
          <div className="progress-container flex items-center cursor-pointer space-x-1 justify-center w-4/5">
            <span className="text-sm">
              {formatTime(currentTime)}
            </span>
            {isAudioLoaded && (
              <div
                className="progress-bar relative h-2 w-2/3 bg-white rounded-full"
                onClick={handleProgressBarClick}
              >
                <div
                  className="progress absolute top-0 left-0 h-full bg-pink-600 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}
            <span className="text-sm">
              {formatTime(duration)}
            </span>
          </div>
        </div>
        <div className="other-features flex items-center gap-4">
          <div className="volume-bar cursor-pointer flex items-center gap-4">
            {isMuted && <VolumeX onClick={handleMuteToggle} />}
            {!isMuted && audioRef.current && audioRef.current?.volume === 0 && (
              <VolumeX onClick={handleMuteToggle} />
            )}
            {!isMuted && audioRef.current && audioRef.current?.volume > 0.7 && (
              <Volume2 onClick={handleMuteToggle} />
            )}
            {!isMuted &&
              audioRef.current &&
              audioRef.current?.volume <= 0.7 &&
              audioRef.current?.volume > 0.3 && (
                <Volume1 onClick={handleMuteToggle} />
              )}
            {!isMuted &&
              audioRef.current &&
              audioRef.current?.volume <= 0.3 &&
              audioRef.current?.volume > 0 && (
                <Volume onClick={handleMuteToggle} />
              )}

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : audioRef.current?.volume || 0}
              onChange={handleVolumeChange}
              className="slider"
              disabled={!isPlaying}
            />
          </div>
        </div>
        <audio
          ref={audioRef}
          src={audioData.parts[currentIndex].audioUrl}
          preload="metadata"
        />
      </div>
    </>
  );
};

const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export default Player;
