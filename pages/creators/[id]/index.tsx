import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { LiveTalk, User } from "@/types/types";
import Image from "next/image";
import GetLoggedUserData from "@/routes/getLoggedUserData";
import AudioCover from "@/components/common/AudioCover";
import LiveCover from "@/components/common/LiveCover";
import useFollowHandler from "@/hooks/useFollowHandler";
import { Skeleton } from "@/components/ui/skeleton";
import Filter from "@/components/common/Filter";

const Creator = ({ creator }: { creator: User }) => {
  const { loggedUserData } = GetLoggedUserData();
  const { isFollowing, loadingFollowingData, handleFollow, handleUnfollow } =
    useFollowHandler();

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
          <Filter />
          <Separator />
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          {creator.Audio.map((creatorAudio) => (
            <AudioCover key={creatorAudio.id} audioItem={creatorAudio} />
          ))}
          {creator.liveTalks.map((creatorLive: LiveTalk) => (
            <LiveCover key={creatorLive.id} liveItem={creatorLive} />
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
