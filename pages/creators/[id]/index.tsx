import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { LiveTalk, User } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/router";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Radio } from "lucide-react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";

interface Audio {
  id: string;
  parts: AudioPart[];
  coverImage: string;
  title: string;
  category: string;
}

interface AudioPart {
  audioUrl: string;
  partName: string;
}

const Creator = ({ creator }: { creator: User }) => {
  const router = useRouter();
  const {
    setAudioData,
    setCurrentIndex,
    playPauseHandler,
    audioRef,
    currentIndex,
    isPlaying,
  } = useAudioPlayer();

  const handleAudioSelect = (audio: Audio, startIndex: number = 0) => {
    setAudioData(audio);
    setCurrentIndex(startIndex);
    if (audioRef.current) {
      const audioItem = audio.parts[startIndex];
      audioRef.current.src = audioItem.audioUrl;
      audioRef.current.load();
      playPauseHandler();
    }
  };

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center gap-6">
          <div className="space-y-1 w-full">
            <Image
              className="md:w-52 rounded-full aspect-square border-4 border-yellow-500 md:h-52 w-32 h-32 mx-auto object-cover object-center"
              alt={creator.name}
              src={creator.profileImage || ""}
              width={208}
              height={208}
            />
          </div>
          <div className="flex items-start flex-col space-y-2">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-3xl text-yellow-500">
                <span className="font-medium text-white">Creator</span>&nbsp;
                {creator.name}
              </h3>
              <Button size="sm" variant="ghost">
                Follow
              </Button>
            </div>
            <p>{creator.bio}</p>
          </div>
        </div>
        <div className="mb-4 mt-12 space-y-2">
          <div className="flex justify-end items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px] h-7">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] h-7">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-[180px] h-7">
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {creator.Audio.map((audio) => (
            <div key={audio.id} className="space-y-3">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    onClick={() => handleAudioSelect(audio)}
                    className="overflow-hidden cursor-pointer rounded-md"
                  >
                    <Image
                      src={audio.coverImage}
                      alt={audio.title}
                      width={150}
                      height={150}
                      objectFit="contain"
                      className="transition-all hover:scale-105 aspect-square"
                    />
                  </div>
                </ContextMenuTrigger>
                {/* <ContextMenuContent className="w-40">
                <ContextMenuItem>Add to Library</ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
                  <ContextMenuSubContent className="w-48">
                    <ContextMenuItem>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      New Playlist
                    </ContextMenuItem>
                    <ContextMenuSeparator />
                    {playlists.map((playlist) => (
                      <ContextMenuItem key={playlist}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          className="mr-2 h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                        </svg>
                        {playlist}
                      </ContextMenuItem>
                    ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem>Play Next</ContextMenuItem>
                <ContextMenuItem>Play Later</ContextMenuItem>
                <ContextMenuItem>Create Station</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Like</ContextMenuItem>
                <ContextMenuItem>Share</ContextMenuItem>
              </ContextMenuContent> */}
              </ContextMenu>
              <div className="space-y-1 text-sm">
                <h3
                  onClick={() => handleAudioSelect(audio)}
                  className="font-medium leading-none"
                >
                  {audio.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {audio.category}
                </p>
              </div>
            </div>
          ))}
          {creator.liveTalks.map((live: LiveTalk) => (
            <div key={live.id} className="space-y-3">
              <Link href={`/live/${live.roomId}`}>
                <div className="relative">
                  <Image
                    src={live.user.profileImage || ""}
                    alt={live.title}
                    width={150}
                    height={150}
                    objectFit="contain"
                    className="rounded-full aspect-square relative border-4 border-red-600"
                  />
                  <div className="bg-white absolute -bottom-2 left-1/2 px-1 rounded-3xl transform -translate-x-1/2">
                    <Radio className="animate-pulse text-red-600" />
                  </div>
                </div>
                <div className="space-y-1 text-sm text-center">
                  <p className="font-medium leading-none">{live.title}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  try {
    const creator = await prisma.user.findUnique({
      where: { id },
      include: {
        Audio: {
          include: {
            user: true,
          },
        },
        liveTalks: {
          where: {
            status: true,
          },
          include: {
            user: true,
          },
        },
      },
    });
    if (!creator) {
      return {
        notFound: true,
      };
    }
    const formattedCreator = {
      ...creator,
      createdAt: creator.createdAt.toISOString(),
      updatedAt: creator.updatedAt.toISOString(),
      expiryDate: creator.expiryDate ? creator.expiryDate.toISOString() : null,
      Audio: creator.Audio.map((audioItem: any) => ({
        ...audioItem,
        createdAt: audioItem.createdAt.toISOString(),
        updatedAt: audioItem.updatedAt.toISOString(),
        expiryDate: audioItem.expiryDate
          ? audioItem.expiryDate.toISOString()
          : null,
        user: {
          ...audioItem.user,
          createdAt: audioItem.user.createdAt.toISOString(),
          updatedAt: audioItem.user.updatedAt.toISOString(),
          expiryDate: audioItem.user.expiryDate
            ? audioItem.user.expiryDate.toISOString()
            : null,
        },
      })),
      liveTalks: creator.liveTalks.map((liveItem: any) => ({
        ...liveItem,
        createdAt: liveItem.createdAt.toISOString(),
        updatedAt: liveItem.updatedAt.toISOString(),
        expiryDate: liveItem.expiryDate
          ? liveItem.expiryDate.toISOString()
          : null,
        user: {
          ...liveItem.user,
          createdAt: liveItem.user.createdAt.toISOString(),
          updatedAt: liveItem.user.updatedAt.toISOString(),
          expiryDate: liveItem.user.expiryDate
            ? liveItem.user.expiryDate.toISOString()
            : null,
        },
      })),
    };

    return {
      props: {
        creator: formattedCreator,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        creator: [],
      },
    };
  }
}

export default Creator;
