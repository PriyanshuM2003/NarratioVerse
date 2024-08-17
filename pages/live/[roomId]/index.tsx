import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import usePlayer from "@/hooks/usePlayer";
import { useRouter } from "next/router";
import Player from "@/components/liveRoom/roomPlayer";
import Bottom from "@/components/liveRoom/bottom";
import CopySection from "@/components/liveRoom/copySection";
import { useSocket } from "@/context/socket";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { Eye, Radio } from "lucide-react";
import { getAccessToken } from "@/lib/auth";

interface UserData {
  [key: string]: {
    name: string;
    profileImage: string;
    isHost: boolean;
  };
}

interface LiveTalkData {
  status: boolean;
  title: string;
  viewers: number;
}

const Room = ({
  userData,
  liveTalkData,
}: {
  userData: UserData;
  liveTalkData: LiveTalkData;
}) => {
  const socket = useSocket();
  const router = useRouter();
  const { roomId } = useRouter().query;
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId, roomId as string, peer, userData);

  const [users, setUsers] = useState<any[]>([]);
  const [viewerCount, setViewerCount] = useState<number>(0);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }
    if (!socket || !peer || !stream) return;
    const handleUserConnected = (newUser: string) => {
      console.log(`user connected in room with userId ${newUser}`);
      setViewerCount((prevCount) => prevCount + 1);
      const roomId = router.query.roomId as string;
      fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updateviews`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId }),
      });
      if (!userData) {
        return;
      }
      const call = peer.call(newUser, stream);
      call.on("stream", (incomingStream: any) => {
        console.log(`incoming stream from ${newUser}`);
        setPlayers((prev) => ({
          ...prev,
          [newUser]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [newUser]: call,
        }));
        router.replace(router.asPath);
      });
    };
    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, setPlayers, socket, stream, router]);

  useEffect(() => {
    if (!userData) {
      return;
    }
    if (!socket) return;
    const handleToggleAudio = (userId: string) => {
      console.log(`user with id ${userId} toggled audio`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].muted = !copy[userId].muted;
        return { ...copy };
      });
    };

    const handleToggleVideo = (userId: string) => {
      if (!userData) {
        return;
      }
      console.log(`user with id ${userId} toggled video`);
      setPlayers((prev) => {
        const copy = cloneDeep(prev);
        copy[userId].playing = !copy[userId].playing;
        return { ...copy };
      });
    };

    const handleUserLeave = (userId: string) => {
      console.log(`user ${userId} is leaving the room`);
      users[userId as keyof typeof users]?.close();
      const playersCopy = cloneDeep(players);
      delete playersCopy[userId];
      setPlayers(playersCopy);
      setViewerCount((prevCount) => Math.max(prevCount - 1, 0));
    };

    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);
    return () => {
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
    };
  }, [players, setPlayers, socket, users]);

  useEffect(() => {
    if (!userData) {
      return;
    }
    if (!peer || !stream) return;
    peer.on("call", (call: any) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream: any) => {
        console.log(`incoming stream from ${callerId}`);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: {
            url: incomingStream,
            muted: true,
            playing: true,
          },
        }));

        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
        }));
      });
    });
  }, [peer, setPlayers, stream]);

  useEffect(() => {
    if (!userData) {
      return;
    }
    if (!stream || !myId) return;
    console.log(`setting my stream ${myId}`);
    setPlayers((prev) => ({
      ...prev,
      [myId]: {
        url: stream,
        muted: true,
        playing: true,
      },
    }));
  }, [myId, setPlayers, stream]);

  useEffect(() => {
    updatePeerId(myId, roomId as string);
  }, [myId, roomId]);

  const updatePeerId = async (myId: string, roomId: string) => {
    try {
      if (!userData) {
        return;
      }
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }
      await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/peer`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: roomId,
          peerId: myId,
        }),
      });
      router.replace(router.asPath);
    } catch (error) {
      console.error("Error updating peerId:", error);
    }
  };

  return (
    <>
      <div className="px-4 pt-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            {liveTalkData.title}
          </h2>
          {liveTalkData.status && (
            <Radio className="text-red-600 animate-pulse" />
          )}
          <div className="gap-2 flex items-center">
            {userData[myId]?.isHost && (
              <div className="flex items-center bg-red-600 p-2 gap-2 rounded-md">
                <Eye className="text-white h-5 w-5" />
                <span className="text-white text-sm">{viewerCount}</span>
              </div>
            )}
            <CopySection roomId={roomId as string} user={userData[myId]} />
          </div>
        </div>
        <Separator className="my-2" />
        <div>
          <div className="grid items-center grid-cols-3 gap-4">
            {userData[myId] && playerHighlighted && (
              <div className="flex items-center w-full relative flex-col">
                <Player
                  url={playerHighlighted.url}
                  muted={playerHighlighted.muted}
                  playing={playerHighlighted.playing}
                  isActive
                  user={userData[myId]}
                />
                <p className="text-white font-semibold text-lg absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  You
                </p>
              </div>
            )}
            {Object.keys(nonHighlightedPlayers).map((playerId) => {
              const { url, muted, playing } = nonHighlightedPlayers[playerId];
              const participant = userData[playerId];
              return (
                participant && (
                  <div className="flex items-center w-full relative flex-col">
                    <Player
                      key={playerId}
                      url={url}
                      muted={muted}
                      playing={playing}
                      isActive={false}
                      user={participant}
                    />
                    <p className="text-white font-semibold text-lg absolute bottom-2 left-1/2 transform -translate-x-1/2">
                      {participant.name} (
                      {participant.isHost ? "Host" : "Guest"})
                    </p>
                  </div>
                )
              );
            })}
          </div>
        </div>
      </div>
      <Bottom
        user={userData[myId]}
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const roomId = context.params.roomId;

    const liveTalkData = await prisma.liveTalk.findUnique({
      where: {
        roomId: roomId,
      },
    });

    if (!liveTalkData) {
      console.error("Live talk data not found.");
      return {
        notFound: true,
      };
    }

    const participants = await prisma.liveTalkParticipant.findMany({
      where: {
        liveTalkId: liveTalkData.id,
      },
      include: {
        participant: true,
      },
    });

    const userData = participants.reduce((acc: any, participant) => {
      if (participant.peerId) {
        acc[participant.peerId] = {
          name: participant.participant.name,
          profileImage: participant.participant.profileImage,
          isHost: participant.isHost,
        };
      }
      return acc;
    }, {});

    return {
      props: {
        userData,
        liveTalkData: {
          ...liveTalkData,
          createdAt: liveTalkData.createdAt.toISOString(),
          updatedAt: liveTalkData.updatedAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      props: {
        userData: {},
        liveTalkData: {},
      },
    };
  }
}

export default Room;
