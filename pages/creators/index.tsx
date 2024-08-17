"use client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GetLoggedUserData from "@/routes/getLoggedUserData";
import useFollowHandler from "@/hooks/useFollowHandler";
import Filter from "@/components/common/Filter";

const Creators = ({ creators }: { creators: User[] }) => {
  const { loggedUserData } = GetLoggedUserData();
  const { isFollowing, loadingFollowingData, handleFollow, handleUnfollow } =
    useFollowHandler();

  if (!creators) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Creators</h2>
          </div>
          <Filter />
        </div>
        <Separator className="my-4" />
        <div className="flex gap-6 flex-wrap">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="space-y-1 flex items-center flex-col"
            >
              <Link href={`/creators/${creator.id}`}>
                <div className="space-y-1">
                  <Image
                    src={creator.profileImage || ""}
                    alt={creator.name}
                    width={150}
                    height={150}
                    objectFit="contain"
                    className="rounded-full aspect-square border-4 border-yellow-500"
                  />
                  <p className="font-semibold text-center">
                    {creator.id !== loggedUserData?.id ? (
                      <>{creator.name}</>
                    ) : (
                      <>You</>
                    )}
                  </p>
                </div>
              </Link>
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
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps(context: any) {
  try {
    const creators = await prisma.user.findMany({
      where: { creator: true },
    });

    const formattedCreators = creators.map((creator) => {
      const formattedUser = {
        ...creator,
        createdAt: creator.createdAt.toISOString(),
        updatedAt: creator.updatedAt.toISOString(),
      };
      return {
        ...creator,
        createdAt: creator.createdAt.toISOString(),
        updatedAt: creator.updatedAt.toISOString(),
        user: formattedUser,
      };
    });

    return {
      props: {
        creators: formattedCreators,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        creators: [],
      },
    };
  }
}

export default Creators;
