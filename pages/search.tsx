"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { User } from "@/types/types";
import { Radio, Search } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
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
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { updateStreamCount } from "@/routes/updateStreamCount";
import { useToast } from "@/components/ui/use-toast";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import { removeFromPlaylist } from "@/routes/removeFromPlaylist";
import { Skeleton } from "@/components/ui/skeleton";
import { createPlaylist } from "@/routes/createPlaylist";
import { Loader, PlusCircle } from "lucide-react";
import PlaylistDialog from "@/components/playlist/playlistDialog";
import { Button } from "@/components/ui/button";
import { addFollow } from "@/routes/addFollow";
import { removeFollowing } from "@/routes/removeFollowing";
import GetFollowingData from "@/routes/getFollowingData";
import GetLoggedUserData from "@/routes/getLoggedUserData";

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
  const router = useRouter();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const { playlistsData, loadingPlaylistsData, refreshPlaylists } =
    GetPlaylistsData();

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
    updateStreamCount(audio.id as string, router, toast);
  };

  const handleRemoveFromPlaylist = async (
    playlistName: string,
    audioId: string
  ) => {
    const removed = await removeFromPlaylist(
      audioId,
      playlistName,
      router,
      toast
    );
    if (removed) {
      refreshPlaylists();
    }
  };

  const [isFollowing, setIsFollowing] = useState<any | null>(null);
  const { followingData, loadingFollowingData, setLoadingFollowingData } =
    GetFollowingData();

  const { loggedUserData } = GetLoggedUserData();

  useEffect(() => {
    if (followingData) {
      setIsFollowing(followingData);
    }
  }, [followingData]);

  const handleFollow = async (creatorId: string) => {
    try {
      setLoadingFollowingData(true);
      await addFollow(creatorId, router, toast);
      setIsFollowing((prevFollowingData: any) => ({
        ...prevFollowingData,
        followedId: [...prevFollowingData.followedId, creatorId],
      }));
    } catch (error) {
      console.error("Error following creator:", error);
    } finally {
      setLoadingFollowingData(false);
    }
  };

  const handleUnfollow = async (creatorId: string) => {
    try {
      setLoadingFollowingData(true);
      await removeFollowing(creatorId, router, toast);
      setIsFollowing((prevFollowingData: any) => ({
        ...prevFollowingData,
        followedId: prevFollowingData.followedId.filter(
          (id: string) => id !== creatorId
        ),
      }));
    } catch (error) {
      console.error("Error unfollowing creator:", error);
    } finally {
      setLoadingFollowingData(false);
    }
  };

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
                      <ContextMenu>
                        <ContextMenuTrigger>
                          <div
                            onClick={() => handleAudioSelect(result as Audio)}
                            className="overflow-hidden cursor-pointer rounded-md"
                          >
                            <Image
                              src={(result as Audio).coverImage}
                              alt={(result as Audio).title}
                              width={150}
                              height={150}
                              objectFit="contain"
                              className={cn(
                                "transition-all hover:scale-105 aspect-square"
                              )}
                            />
                          </div>
                        </ContextMenuTrigger>
                        <ContextMenuContent className="w-40">
                          <ContextMenuSub>
                            <ContextMenuSubTrigger>
                              Add to Playlist
                            </ContextMenuSubTrigger>
                            <ContextMenuSubContent className="w-48">
                              <ContextMenuItem
                                onClick={() => {
                                  setDialogOpen(true);
                                  setSelectedAudioId((result as Audio).id);
                                }}
                              >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                New Playlist
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              {loadingPlaylistsData ? (
                                <Loader className="animate-spin flex mx-auto my-4" />
                              ) : (
                                playlistsData?.map((playlist) => (
                                  <ContextMenuItem
                                    key={playlist.id}
                                    onClick={async () => {
                                      await createPlaylist(
                                        (result as Audio).id,
                                        playlist.name,
                                        router,
                                        toast
                                      );

                                      refreshPlaylists();
                                    }}
                                  >
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
                                    {playlist.name}
                                  </ContextMenuItem>
                                ))
                              )}
                            </ContextMenuSubContent>
                          </ContextMenuSub>
                          <ContextMenuSeparator />
                          {playlistsData?.map((playlist) => {
                            const audioExistsInPlaylist = playlist.audios.some(
                              (audio) => audio.id === (result as Audio).id
                            );
                            if (audioExistsInPlaylist) {
                              return (
                                <ContextMenuItem
                                  key={playlist.id}
                                  className="text-nowrap"
                                  onClick={() =>
                                    handleRemoveFromPlaylist(
                                      playlist.name,
                                      (result as Audio).id
                                    )
                                  }
                                >
                                  Remove from {playlist.name}
                                </ContextMenuItem>
                              );
                            }
                            return null;
                          })}

                          {/* <ContextMenuSeparator />
                  <ContextMenuItem>Like</ContextMenuItem>
                  <ContextMenuItem>Share</ContextMenuItem> */}
                        </ContextMenuContent>
                      </ContextMenu>
                      <div className="space-y-1 text-sm">
                        <h3
                          onClick={() => handleAudioSelect(result as Audio)}
                          className="font-medium leading-none cursor-pointer hover:text-white/80"
                        >
                          {(result as Audio).title}
                        </h3>
                        <p
                          onClick={() => handleAudioSelect(result as Audio)}
                          className="text-xs cursor-pointer text-muted-foreground hover:text-white/50"
                        >
                          {(result as Audio).category}
                        </p>
                        <Link href={`/creators/${(result as Audio).user.id}`}>
                          <p className="text-xs cursor-pointer text-muted-foreground hover:text-white/50">
                            {(result as Audio).user.name}
                          </p>
                        </Link>
                      </div>
                    </div>
                  </>
                )}
                {"title" in result && "status" in result && (
                  <>
                    <div className="space-y-3">
                      <Link href={`/live/${(result as LiveTalk).roomId}`}>
                        <div className="relative">
                          <Image
                            src={(result as LiveTalk).user.profileImage || ""}
                            alt={(result as LiveTalk).title}
                            width={150}
                            height={150}
                            objectFit="contain"
                            className="rounded-full aspect-square relative border-4 border-red-600"
                          />
                          <div className="bg-white absolute -bottom-2 left-1/2 px-1 rounded-3xl transform -translate-x-1/2">
                            <Radio className="animate-pulse text-red-600" />
                          </div>
                        </div>
                      </Link>
                      <div className="space-y-1 text-sm text-center">
                        <p className="text-xs text-muted-foreground">
                          {(result as LiveTalk).user.name}
                        </p>
                        <Link href={`/live/${(result as LiveTalk).roomId}`}>
                          <p className="font-medium leading-none">
                            {(result as LiveTalk).title}
                          </p>
                        </Link>
                      </div>
                    </div>
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
      {dialogOpen && (
        <PlaylistDialog
          audioId={selectedAudioId || ""}
          setDialogOpen={setDialogOpen}
          dialogOpen={dialogOpen}
        />
      )}
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
