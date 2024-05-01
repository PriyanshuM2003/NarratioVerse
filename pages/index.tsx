"use client";
import Head from "next/head";
import Trending from "./trending";
import prisma from "@/lib/prisma";
import { Audio, LiveTalk } from "@/types/trendingTypes";

export default function Home({
  audio,
  liveTalks,
  isLoggedIn,
}: {
  isLoggedIn:boolean;
  audio: Audio[];
  liveTalks: LiveTalk[];
}) {
  return (
    <>
      <Head>
        <title>Narratioverse</title>
        <meta name="description" content="Narratioverse" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <main>
        <Trending audio={audio} liveTalks={liveTalks} isLoggedIn={isLoggedIn} />
      </main>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const liveTalks = await prisma.liveTalk.findMany({
      include: {
        user: true,
      },
    });

    const audio = await prisma.audio.findMany({
      include: {
        user: true,
      },
    });
    const formattedLiveTalks = liveTalks.map((liveTalkItem) => {
      const formattedUser = {
        ...liveTalkItem.user,
        createdAt: liveTalkItem.user.createdAt.toISOString(),
        updatedAt: liveTalkItem.user.updatedAt.toISOString(),
      };

      return {
        ...liveTalkItem,
        createdAt: liveTalkItem.createdAt.toISOString(),
        updatedAt: liveTalkItem.updatedAt.toISOString(),
        user: formattedUser,
      };
    });

    const formattedAudio = audio.map((audioItem) => ({
      ...audioItem,
      createdAt: audioItem.createdAt.toISOString(),
      updatedAt: audioItem.updatedAt.toISOString(),
      user: {
        ...audioItem.user,
        createdAt: audioItem.user.createdAt.toISOString(),
        updatedAt: audioItem.user.updatedAt.toISOString(),
      },
    }));
    
    return {
      props: {
        audio: formattedAudio,
        liveTalks: formattedLiveTalks,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        liveTalks: [],
        audio: [],
      },
    };
  }
}
