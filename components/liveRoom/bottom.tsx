import { Mic, Video, PhoneOff, MicOff, VideoOff } from "lucide-react";
interface UserData {
  name: string;
}
interface BottomProps {
  muted: boolean;
  playing: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  leaveRoom: () => void;
  user: UserData;
}

const Bottom = (props: BottomProps) => {
  const { user, muted, playing, toggleAudio, toggleVideo, leaveRoom } = props;

  return (
    <div className="absolute bottom-4 bg-gray-900 w-full">
      <div className="flex items-center justify-center  space-x-20 p-1">
        {user && (
          <>
            {muted ? (
              <div
                onClick={toggleAudio}
                className="p-2 flex items-center justify-center mb-3.5 rounded-full text-white cursor-pointer bg-muted-foreground"
              >
                <MicOff />
              </div>
            ) : (
              <div
                onClick={toggleAudio}
                className="p-2 flex items-center justify-center mb-3.5 rounded-full text-white cursor-pointer bg-muted-foreground"
              >
                <Mic />
              </div>
            )}
            {playing ? (
              <div
                onClick={toggleVideo}
                className="p-2 flex items-center justify-center mb-3.5 rounded-full text-white cursor-pointer bg-muted-foreground"
              >
                <Video />
              </div>
            ) : (
              <div
                onClick={toggleVideo}
                className="p-2 flex items-center justify-center mb-3.5 rounded-full text-white cursor-pointer bg-muted-foreground"
              >
                <VideoOff />
              </div>
            )}
          </>
        )}
        <div
          onClick={leaveRoom}
          className="p-2 flex items-center justify-center mb-3.5 rounded-full text-white cursor-pointer bg-red-500"
        >
          <PhoneOff />
        </div>
      </div>
    </div>
  );
};

export default Bottom;
