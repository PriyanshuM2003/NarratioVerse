"use client";
import Head from "next/head";
import Trending from "./trending";
import prisma from "@/lib/prisma";
import { Audio, LiveTalk } from "@/types/types";

export default function Home({
  audio,
  liveTalks,
  isLoggedIn,
  newAudio,
}: {
  isLoggedIn: boolean;
  audio: Audio[];
  newAudio: Audio[];
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
        <Trending
          audio={audio}
          liveTalks={liveTalks}
          isLoggedIn={isLoggedIn}
          newAudio={newAudio}
        />
      </main>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const liveTalks = await prisma.liveTalk.findMany({
      where: { status: true },
      include: {
        user: true,
      },
    });

    const audio = await prisma.audio.findMany({
      include: {
        user: true,
      },
    });

    const currentDate = new Date();
    const threeDaysAgo = new Date(currentDate);
    threeDaysAgo.setDate(currentDate.getDate() - 3);

    const newAudio = await prisma.audio.findMany({
      where: {
        createdAt: {
          gte: threeDaysAgo,
        },
      },
      include: {
        user: true,
      },
    });

    const formattedLiveTalks = liveTalks.map((liveTalkItem) => {
      const formattedUser = {
        ...liveTalkItem.user,
        createdAt: liveTalkItem.user.createdAt.toISOString(),
        updatedAt: liveTalkItem.user.updatedAt.toISOString(),
        expiryDate: liveTalkItem.user.expiryDate
          ? liveTalkItem.user.expiryDate.toISOString()
          : null,
      };

      return {
        ...liveTalkItem,
        createdAt: liveTalkItem.createdAt.toISOString(),
        updatedAt: liveTalkItem.updatedAt.toISOString(),
        expiryDate: liveTalkItem.user.expiryDate
          ? liveTalkItem.user.expiryDate.toISOString()
          : null,
        user: formattedUser,
      };
    });

    const formattedAudio = audio.map((audioItem) => ({
      ...audioItem,
      createdAt: audioItem.createdAt.toISOString(),
      updatedAt: audioItem.updatedAt.toISOString(),
      expiryDate: audioItem.user.expiryDate
        ? audioItem.user.expiryDate.toISOString()
        : null,
      user: {
        ...audioItem.user,
        createdAt: audioItem.user.createdAt.toISOString(),
        updatedAt: audioItem.user.updatedAt.toISOString(),
        expiryDate: audioItem.user.expiryDate
          ? audioItem.user.expiryDate.toISOString()
          : null,
      },
    }));
    const formattedNewAudio = newAudio.map((audioItem) => ({
      ...audioItem,
      createdAt: audioItem.createdAt.toISOString(),
      updatedAt: audioItem.updatedAt.toISOString(),
      expiryDate: audioItem.user.expiryDate
        ? audioItem.user.expiryDate.toISOString()
        : null,
      user: {
        ...audioItem.user,
        createdAt: audioItem.user.createdAt.toISOString(),
        updatedAt: audioItem.user.updatedAt.toISOString(),
        expiryDate: audioItem.user.expiryDate
          ? audioItem.user.expiryDate.toISOString()
          : null,
      },
    }));

    return {
      props: {
        audio: formattedAudio,
        newAudio: formattedNewAudio,
        liveTalks: formattedLiveTalks,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        liveTalks: [],
        audio: [],
        newAudio: [],
      },
    };
  }
}
