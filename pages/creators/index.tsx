"use client";
import { Separator } from "@/components/ui/separator";
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
import Image from "next/image";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { User } from "@/types/types";
import { Button } from "@/components/ui/button";

const Creators = ({ creators }: { creators: User[] }) => {
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
        <div className="flex items-center gap-6 flex-wrap">
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
                  <p className="font-semibold text-center">{creator.name}</p>
                </div>
              </Link>
              <Button size="sm" variant="ghost">
                Follow
              </Button>
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
