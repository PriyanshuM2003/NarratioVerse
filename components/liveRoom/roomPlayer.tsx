import ReactPlayer from "react-player";

import { cn } from "@/lib/utils";

import { Mic, MicOff } from "lucide-react";
import Image from "next/image";

interface PlayerProps {
  url: string | MediaStream;
  muted: boolean;
  playing: boolean;
  isActive: boolean;
  user?: {
    profileImage: string;
    name: string;
  };
}

const Player: React.FC<PlayerProps> = ({
  url,
  muted,
  playing,
  isActive,
  user,
}: PlayerProps) => {
  return (
    <div
      className={cn("relative w-full overflow-hidden", {
        "rounded-md shadow-md bg-gray-900": !isActive,
        "rounded-lg bg-gray-900": isActive,
        "flex items-center justify-center": !playing,
      })}
    >
      {playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <div className="flex w-full h-[315px] items-center justify-center">
          {user && (
            <>
              <Image
                unoptimized
                width={156}
                height={156}
                src={user.profileImage}
                alt="Profile"
                className="rounded-full"
              />
            </>
          )}
        </div>
      )}

      {!isActive ? (
        muted ? (
          <MicOff className="text-white absolute right-2 bottom-2" size={20} />
        ) : (
          <Mic className="text-white absolute right-2 bottom-2" size={20} />
        )
      ) : undefined}
    </div>
  );
};

export default Player;
