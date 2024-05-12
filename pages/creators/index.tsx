"use client";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";
import { addFollow } from "@/routes/addFollow";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import GetFollowingData from "@/routes/getFollowingData";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { removeFollowing } from "@/routes/removeFollowing";
import GetLoggedUserData from "@/routes/getLoggedUserData";

const Creators = ({ creators }: { creators: User[] }) => {
  const router = useRouter();
  const { toast } = useToast();
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

  return (
    <>
      <div className="min-h-screen px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Creators</h2>
          </div>
          <div className="flex items-center gap-2">
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
        expiryDate: creator.expiryDate
          ? creator.expiryDate.toISOString()
          : null,
      };
      return {
        ...creator,
        createdAt: creator.createdAt.toISOString(),
        updatedAt: creator.updatedAt.toISOString(),
        expiryDate: creator.expiryDate
          ? creator.expiryDate.toISOString()
          : null,
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
