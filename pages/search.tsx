"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { User } from "@/types/types";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import GetLoggedUserData from "@/routes/getLoggedUserData";
import AudioCover from "@/components/common/AudioCover";
import LiveCover from "@/components/common/LiveCover";
import useFollowHandler from "@/hooks/useFollowHandler";

interface Audio {
  id: string;
  user: User;
  title: string;
  category: string;
  coverImage: string;
  parts: AudioPart[];
}

interface AudioPart {
  audioUrl: string;
  partName: string;
}

interface LiveTalk {
  user: User;
  title: string;
  status: boolean;
  genres: string[];
  profileImage?: string;
  roomId: string;
}

interface Props {
  audio: Audio[];
  liveTalks: LiveTalk[];
  creator: User[];
}

export default function SearchPage({ audio, liveTalks, creator }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<
    (Audio | LiveTalk | User)[]
  >([]);
  const { loggedUserData } = GetLoggedUserData();
  const { isFollowing, loadingFollowingData, handleFollow, handleUnfollow } =
    useFollowHandler();

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    const filteredAudios = audio.filter((audio) =>
      audio.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredLiveTalks = liveTalks.filter((liveTalk) =>
      liveTalk.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredCreators = creator.filter((creator) =>
      creator.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults([
      ...filteredAudios,
      ...filteredLiveTalks,
      ...filteredCreators,
    ]);
  }, [searchQuery, audio, liveTalks, creator]);

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex justify-center relative">
          <Input
            type="search"
            placeholder="Search"
            className="w-1/2 pr-12"
            onChange={handleSearchInputChange}
            value={searchQuery}
          />
          <Search className="text-black absolute translate-x-72 mt-2" />
        </div>
        <Separator className="my-4" />
        <div className="flex items-center gap-4 flex-wrap">
          {searchResults.length > 0 &&
            searchResults.map((result, index) => (
              <div key={index}>
                {!("name" in result) && "id" in result && (
                  <>
                    <div className="space-y-3 gap-4" key={(result as Audio).id}>
                      <AudioCover audioItem={result as Audio} />
                    </div>
                  </>
                )}
                {"title" in result && "status" in result && (
                  <>
                    <LiveCover liveItem={result as LiveTalk} />
                  </>
                )}
                {"name" in result && (
                  <>
                    <div
                      key={(result as User).id}
                      className="space-y-1 flex items-center flex-col"
                    >
                      <Link href={`/creators/${(result as User).id}`}>
                        <div className="space-y-1">
                          <Image
                            src={(result as User).profileImage || ""}
                            alt={(result as User).name}
                            width={150}
                            height={150}
                            objectFit="contain"
                            className="rounded-full aspect-square border-4 border-yellow-500"
                          />
                          <p className="font-semibold text-center">
                            {(result as User).name}
                          </p>
                        </div>
                      </Link>
                      {result.id !== loggedUserData?.id ? (
                        <>
                          {loadingFollowingData ? (
                            <Skeleton className="h-5 w-full" />
                          ) : (
                            <>
                              {isFollowing &&
                              isFollowing.followedId.includes(result.id) ? (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleUnfollow(result.id)}
                                >
                                  Following
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleFollow(result.id)}
                                >
                                  Follow
                                </Button>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>You</>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          {searchResults.length === 0 && searchQuery.trim() !== "" && (
            <p>No results found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context: any) {
  try {
    const liveTalks = await prisma.liveTalk.findMany({
      where: {
        status: true,
      },
      include: {
        user: true,
      },
    });

    const audio = await prisma.audio.findMany({
      include: {
        user: true,
      },
    });

    const creator = await prisma.user.findMany({
      where: {
        creator: true,
      },
    });

    const formattedLiveTalks = liveTalks.map((liveTalkItem) => ({
      ...liveTalkItem,
      createdAt: liveTalkItem.createdAt.toISOString(),
      updatedAt: liveTalkItem.updatedAt.toISOString(),

      user: {
        ...liveTalkItem.user,
        createdAt: liveTalkItem.user.createdAt.toISOString(),
        updatedAt: liveTalkItem.user.updatedAt.toISOString(),
      },
    }));

    const formattedCreator = creator.map((creatorItem) => ({
      ...creatorItem,
      createdAt: creatorItem.createdAt.toISOString(),
      updatedAt: creatorItem.updatedAt.toISOString(),
    }));

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
        creator: formattedCreator,
        audio: formattedAudio,
        liveTalks: formattedLiveTalks,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        creator: [],
        liveTalks: [],
        audio: [],
      },
    };
  }
}
