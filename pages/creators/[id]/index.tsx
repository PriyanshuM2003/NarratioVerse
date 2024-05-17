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
import { Loader, PlusCircle, Radio } from "lucide-react";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import { updateStreamCount } from "@/routes/updateStreamCount";
import { useToast } from "@/components/ui/use-toast";
import { addFollow } from "@/routes/addFollow";
import { removeFollowing } from "@/routes/removeFollowing";
import { Skeleton } from "@/components/ui/skeleton";
import GetFollowingData from "@/routes/getFollowingData";
import { useEffect, useState } from "react";
import { removeFromPlaylist } from "@/routes/removeFromPlaylist";
import GetPlaylistsData from "@/routes/getPlaylistsData";
import PlaylistDialog from "@/components/playlist/playlistDialog";
import { createPlaylist } from "@/routes/createPlaylist";
import GetLoggedUserData from "@/routes/getLoggedUserData";

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
  const { toast } = useToast();
  const {
    setAudioData,
    setCurrentIndex,
    playPauseHandler,
    audioRef,
    currentIndex,
    isPlaying,
  } = useAudioPlayer();
  const [isFollowing, setIsFollowing] = useState<any | null>(null);
  const { followingData, loadingFollowingData, setLoadingFollowingData } =
    GetFollowingData();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const { playlistsData, loadingPlaylistsData, refreshPlaylists } =
    GetPlaylistsData();

  const { loggedUserData } = GetLoggedUserData();

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

  if (!creator) {
    return null;
  }

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
                {creator.id !== loggedUserData?.id ? (
                  <>{creator.name}</>
                ) : (
                  <>You</>
                )}
              </h3>
              {creator.id !== loggedUserData?.id ? (
                <>
                  {loadingFollowingData ? (
                    <Skeleton className="h-5 w-full" />
                  ) : (
                    <>
                      {isFollowing &&
                      isFollowing.followedId.includes(creator.id) ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUnfollow(creator.id)}
                        >
                          Following
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleFollow(creator.id)}
                        >
                          Follow
                        </Button>
                      )}
                    </>
                  )}
                </>
              ) : (
                <></>
              )}
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
          {creator.Audio.map((creatorAudio) => (
            <div key={creatorAudio.id} className="space-y-3">
              <ContextMenu>
                <ContextMenuTrigger>
                  <div
                    onClick={() => handleAudioSelect(creatorAudio)}
                    className="overflow-hidden cursor-pointer rounded-md"
                  >
                    <Image
                      src={creatorAudio.coverImage}
                      alt={creatorAudio.title}
                      width={150}
                      height={150}
                      objectFit="contain"
                      className="transition-all hover:scale-105 aspect-square"
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
                          setSelectedAudioId(creatorAudio.id);
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
                                creatorAudio.id,
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
                      (audio) => audio.id === creatorAudio.id
                    );
                    if (audioExistsInPlaylist) {
                      return (
                        <ContextMenuItem
                          key={playlist.id}
                          className="text-nowrap"
                          onClick={() =>
                            handleRemoveFromPlaylist(
                              playlist.name,
                              creatorAudio.id
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
                  onClick={() => handleAudioSelect(creatorAudio)}
                  className="font-medium leading-none"
                >
                  {creatorAudio.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {creatorAudio.category}
                </p>
              </div>
            </div>
          ))}
          {creator.liveTalks.map((creatorLive: LiveTalk) => (
            <div key={creatorLive.id} className="space-y-3">
              <Link href={`/live/${creatorLive.roomId}`}>
                <div className="relative">
                  <Image
                    src={creatorLive.user.profileImage || ""}
                    alt={creatorLive.title}
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
                  <p className="font-medium leading-none">
                    {creatorLive.title}
                  </p>
                </div>
              </Link>
            </div>
          ))}
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
      Audio: creator.Audio.map((audioItem: any) => ({
        ...audioItem,
        createdAt: audioItem.createdAt.toISOString(),
        updatedAt: audioItem.updatedAt.toISOString(),
       
        user: {
          ...audioItem.user,
          createdAt: audioItem.user.createdAt.toISOString(),
          updatedAt: audioItem.user.updatedAt.toISOString(),
         
        },
      })),
      liveTalks: creator.liveTalks.map((liveItem: any) => ({
        ...liveItem,
        createdAt: liveItem.createdAt.toISOString(),
        updatedAt: liveItem.updatedAt.toISOString(),
       
        user: {
          ...liveItem.user,
          createdAt: liveItem.user.createdAt.toISOString(),
          updatedAt: liveItem.user.updatedAt.toISOString(),
          
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
