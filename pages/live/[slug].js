"use client";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import prisma from "@/lib/prisma";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mic, MicOff, X } from "lucide-react";

const Live = ({ initiateLiveTalk }) => {
  const [liveTalk, setLiveTalk] = useState(initiateLiveTalk);
  const [acceptedParticipants, setAcceptedParticipants] = useState([]);
  const [isMicOn, setIsMicOn] = useState(true);
  const [participantMicStatus, setParticipantMicStatus] = useState({});

  const socketRef = useRef();

  useEffect(() => {
    const fetchAcceptedParticipants = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/live?slug=${initiateLiveTalk.slug}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch live talk");
        }
        const data = await response.json();
        setLiveTalk(data.initiateLiveTalk);
        setAcceptedParticipants([...data.initiateLiveTalk.participants]);

        const initialParticipantMicStatus = {};
        data.initiateLiveTalk.participants.forEach((participant) => {
          initialParticipantMicStatus[participant.id] = true;
        });
        setParticipantMicStatus(initialParticipantMicStatus);
      } catch (error) {
        console.error("Error fetching live talk:", error);
      }
    };
    fetchAcceptedParticipants();

    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      upgrade: false,
    });

    socketRef.current = socket;
    
    socket.on("connect", () => {
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then((stream) => {
          const audioContext = new AudioContext();
          const audioSource = audioContext.createMediaStreamSource(stream);
    
          const bufferSize = 4096;
          const scriptProcessorNode = audioContext.createScriptProcessor(bufferSize, 1, 1);
          audioSource.connect(scriptProcessorNode);
    
          scriptProcessorNode.onaudioprocess = function (event) {
            const audioBuffer = event.inputBuffer.getChannelData(0);
            const audioData = encodePCM(audioBuffer);
            socket.emit("audioStream", audioData);
          };
    
          scriptProcessorNode.connect(audioContext.destination);
        })
        .catch((error) => {
          console.error("Error capturing audio.", error);
        });
    });
    
    socket.on("audioStream", (audioData) => {
      const audioContext = new AudioContext();
      const audioBuffer = decodePCM(audioData, audioContext);
      const audioSource = audioContext.createBufferSource();
      audioSource.buffer = audioBuffer;
      audioSource.connect(audioContext.destination);
      audioSource.start();
    });
    
    function encodePCM(audioBuffer) {
      const length = audioBuffer.length * 2;
      const buffer = new ArrayBuffer(length);
      const view = new DataView(buffer);
      let index = 0;
    
      for (let i = 0; i < audioBuffer.length; i++) {
        view.setInt16(index, audioBuffer[i] * 0x7FFF, true);
        index += 2;
      }
    
      return buffer;
    }
    
    function decodePCM(audioData, audioContext) {
      const length = audioData.byteLength / 2;
      const buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
      const view = new DataView(audioData);
      const channelData = buffer.getChannelData(0);
    
      let index = 0;
      for (let i = 0; i < length; i++) {
        channelData[i] = view.getInt16(index, true) / 0x7FFF;
        index += 2;
      }
    
      return buffer;
    }

    socket.on("participantJoined", (participant) => {
      setAcceptedParticipants((prevParticipants) => [
        ...prevParticipants,
        participant,
      ]);
      setParticipantMicStatus((prevStatus) => ({
        ...prevStatus,
        [participant.id]: true,
      }));
    });

    socket.on("micStatusChanged", ({ participantId, isMicOn }) => {
      setParticipantMicStatus((prevStatus) => ({
        ...prevStatus,
        [participantId]: isMicOn,
      }));
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [initiateLiveTalk.slug]);

  // Toggle mic for the host
  const toggleMic = () => {
    const newMicStatus = !isMicOn;
    setIsMicOn(newMicStatus);
    socketRef.current.emit("micStatusChange", {
      participantId: initiateLiveTalk.hostUser.id,
      isMicOn: newMicStatus,
    });
  };

  // Toggle mic for a participant
  const toggleParticipantMic = (participantId) => {
    const newMicStatus = !participantMicStatus[participantId];
    setParticipantMicStatus((prevStatus) => ({
      ...prevStatus,
      [participantId]: newMicStatus,
    }));
    socketRef.current.emit("micStatusChange", {
      participantId,
      isMicOn: newMicStatus,
    });
  };

  return (
    <>
      <div className="p-8 text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            {liveTalk.title}
          </h2>
        </div>
        <Separator className="my-4" />
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="w-[250px]">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center flex-col">
                  <img
                    className="md:w-32 md:h-32 w-24 h-24 mx-auto object-cover object-center rounded-full"
                    alt={initiateLiveTalk.hostUser.name}
                    src={initiateLiveTalk.hostUser.profileImage}
                  />
                  <p>{initiateLiveTalk.hostUser.name}</p>
                </div>
              </CardTitle>
              <CardDescription>
                <span className="flex justify-center">Host</span>
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
              <button onClick={toggleMic}>
                {isMicOn ? <Mic /> : <MicOff />}
              </button>
              <X />
            </CardFooter>
          </Card>
          {acceptedParticipants.map((participant) => (
            <Card key={participant.id} className="w-[250px]">
              <CardHeader>
                <CardTitle>
                  <div className="flex items-center flex-col">
                    <img
                      className="md:w-32 md:h-32 w-24 h-24 mx-auto object-cover object-center rounded-full"
                      alt={participant.guestUser.name}
                      src={participant.guestUser.profileImage}
                    />
                    <p>{participant.guestUser.name}</p>
                  </div>
                </CardTitle>
                <CardDescription>
                  <span className="flex justify-center">Participant</span>
                </CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-between">
                <button onClick={() => toggleParticipantMic(participant.id)}>
                  {participantMicStatus[participant.id] ? <Mic /> : <MicOff />}
                </button>
                <X />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.params;

  try {
    const liveTalk = await prisma.liveTalk.findUnique({
      where: {
        slug,
      },
      include: {
        hostUser: {
          select: {
            id: true,
            name: true,
            profileImage: true,
          },
        },
      },
    });

    if (!liveTalk) {
      return {
        notFound: true,
      };
    }

    liveTalk.createdAt = new Date(liveTalk.createdAt).toISOString();
    liveTalk.updatedAt = new Date(liveTalk.updatedAt).toISOString();

    return {
      props: {
        initiateLiveTalk: liveTalk,
      },
    };
  } catch (error) {
    console.error("Error fetching live talk:", error);
    return {
      notFound: true,
    };
  }
}

export default Live;
