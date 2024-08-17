import { useEffect, useState } from "react";
interface AudioPart {
  audioUrl: string;
}
export default function useFormattedDuration(audioParts: AudioPart[]) {
  const [totalDuration, setTotalDuration] = useState<number>(0);
  useEffect(() => {
    const calculateDuration = async () => {
      if (audioParts.length === 0) return;

      const durations = await Promise.all(
        audioParts.map(
          (part) =>
            new Promise<number>((resolve) => {
              const audio = new Audio(part.audioUrl);
              audio.onloadedmetadata = () => resolve(audio.duration);
            })
        )
      );
      setTotalDuration(durations.reduce((a, b) => a + b, 0));
    };

    calculateDuration();
  }, [audioParts]);

  const formatDuration = (duration: number) =>
    duration < 60
      ? `${Math.round(duration)} sec`
      : `${Math.floor(duration / 60)} min ${Math.round(duration % 60)} sec`;
  return { Duration: formatDuration(totalDuration) };
}
