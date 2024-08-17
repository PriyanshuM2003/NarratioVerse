import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/socket";
import { useRouter } from "next/router";
import { getAccessToken } from "@/lib/auth";

interface PlayerData {
  [key: string]: {
    url: string | MediaStream;
    muted: boolean;
    playing: boolean;
  };
}

interface UserData {
  [key: string]: {
    name: string;
    profileImage: string;
    isHost: boolean;
  };
}

const usePlayer = (
  myId: string,
  roomId: string,
  peer: any,
  userData: UserData
) => {
  const socket = useSocket();
  const [players, setPlayers] = useState<PlayerData>({});
  const router = useRouter();
  const playersCopy = cloneDeep(players);

  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];

  const nonHighlightedPlayers = playersCopy;

  const leaveRoom = () => {
    socket?.emit("user-leave", myId, roomId);
    if (userData[myId]?.isHost) {
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }
      fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatestatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });
    }
    peer.disconnect();
    router.replace("/");
  };

  const toggleAudio = () => {
    console.log("I toggled my audio");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].muted = !copy[myId].muted;
      return { ...copy };
    });
    socket?.emit("user-toggle-audio", myId, roomId);
  };

  const toggleVideo = () => {
    console.log("I toggled my video");
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].playing = !copy[myId].playing;
      return { ...copy };
    });
    socket?.emit("user-toggle-video", myId, roomId);
  };

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
    userData,
  };
};

export default usePlayer;
