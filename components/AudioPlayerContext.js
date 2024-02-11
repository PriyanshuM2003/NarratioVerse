import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [audioData, setAudioData] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef(null);

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
    const handleKeyPress = (event) => {
      if (event.code === "Space") {
        playPauseHandler();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [playPauseHandler]);

  const skipHandler = (direction) => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex +
          (direction === "forward" ? 1 : -1) +
          audioData.parts.length) %
        audioData.parts.length
    );
    playPauseHandler();
  };

  const handleVolumeChange = (e) => {
    if (audioRef.current && isPlaying) {
      const newVolume = parseFloat(e.target.value);
      audioRef.current.volume = newVolume;
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
        audioRef,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error(
      "useAudioPlayer must be used within an AudioPlayerProvider"
    );
  }
  return context;
};
