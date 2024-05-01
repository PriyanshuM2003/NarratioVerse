import React, { createContext, useContext, useEffect, useRef, useState } from "react";

interface AudioPlayerProviderProps {
  children: React.ReactNode;
}

interface AudioPart {
  audioUrl: string;
  partName: string;
}

interface AudioData {
  title: string;
  coverImage: string;
  category: string;
  parts: AudioPart[];
}

interface AudioPlayerContextType {
  audioData: AudioData | null;
  setAudioData: (data: AudioData | null) => void;
  isPlaying: boolean;
  playPauseHandler: () => void;
  skipHandler: (direction: "forward" | "backward") => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  handleVolumeChange: (newValue: number) => void;
  volume: number;
  audioRef: React.RefObject<HTMLAudioElement>;
  sliderRef: React.RefObject<HTMLDivElement>;
}

const AudioPlayerContext = createContext<AudioPlayerContextType | null>(null);

export const AudioPlayerProvider: React.FC<AudioPlayerProviderProps> = ({ children }) => {
  const [audioData, setAudioData] = useState<AudioData | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  const playPauseHandler = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }

    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        playPauseHandler();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [playPauseHandler]);

  const skipHandler = (direction: "forward" | "backward") => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex +
          (direction === "forward" ? 1 : -1) +
          (audioData?.parts.length || 0)) %
        (audioData?.parts.length || 1)
    );
    playPauseHandler();
  };

  const handleVolumeChange = (newValue: number) => {
    if (!isFinite(newValue)) {
      return;
    }
    const newVolume = Math.min(100, Math.max(0, newValue));
    const volume = newVolume / 100;
    setVolume(volume);
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        audioData,
        setAudioData,
        isPlaying,
        playPauseHandler,
        skipHandler,
        currentIndex,
        setCurrentIndex,
        handleVolumeChange,
        volume,
        audioRef,
        sliderRef,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = (): AudioPlayerContextType => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
