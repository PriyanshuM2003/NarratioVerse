"use client";
import prisma from "@/lib/prisma";
import React from "react";
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

  useEffect(() => {
    setLiveTalk(initiateLiveTalk);
  }, [initiateLiveTalk]);

  const handleParticipantAcceptance = (participantId) => {
    const updatedParticipants = liveTalk.participants.map((participant) => {
      if (participant.id === participantId) {
        return {
          ...participant,
          accepted: true,
        };
      }
      return participant;
    });

    setLiveTalk({
      ...liveTalk,
      participants: updatedParticipants,
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
              <Mic />
              <MicOff />
              <X />
            </CardFooter>
          </Card>
          {liveTalk.participants.map((participant) => (
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
                <Mic />
                <MicOff />
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
            name: true,
            profileImage: true,
          },
        },
        participants: {
          where: {
            accepted: true,
          },
          include: {
            guestUser: {
              select: {
                name: true,
                profileImage: true,
              },
            },
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

    liveTalk.participants.forEach((participant) => {
      participant.createdAt = new Date(participant.createdAt).toISOString();
      participant.updatedAt = new Date(participant.updatedAt).toISOString();
    });

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
