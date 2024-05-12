"use client";
import { Separator } from "@/components/ui/separator";
import prisma from "@/lib/prisma";
import { LiveTalk } from "@/types/types";
import { Radio } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Live = ({ liveTalks }: { liveTalks: LiveTalk[] }) => {
  return (
    <>
      <div className="h-full px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Live Sessions
            </h2>
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
        <div className="flex items-center gap-4 flex-wrap">
          {liveTalks?.map((live) => (
            <div className="space-y-3" key={live.roomId}>
              <Link href={`/live/${live.roomId}`}>
                <div className="relative">
                  <Image
                    src={live.user.profileImage || ""}
                    alt={live.title}
                    width={150}
                    height={150}
                    className="rounded-full relative border-4 border-red-600 aspect-square"
                  />
                  <div className="bg-white absolute -bottom-2 left-1/2 px-1 rounded-3xl transform -translate-x-1/2">
                    <Radio className="animate-pulse text-red-600" />
                  </div>
                </div>
              </Link>
              <div className="space-y-1 text-sm text-center">
                <p className="text-xs text-muted-foreground">
                  {live.user.name}
                </p>
                <Link href={`/live/${live.roomId}`}>
                  <p className="font-medium leading-none">{live.title}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <Separator />
      </div>
    </>
  );
};
export async function getServerSideProps(context: any) {
  try {
    const liveTalks = await prisma.liveTalk.findMany({
      where: { status: true },
      include: {
        user: true,
      },
    });

    const formattedLiveTalks = liveTalks.map((liveTalkItem) => ({
      ...liveTalkItem,
      createdAt: liveTalkItem.createdAt.toISOString(),
      updatedAt: liveTalkItem.updatedAt.toISOString(),
      expiryDate: liveTalkItem.user.expiryDate
        ? liveTalkItem.user.expiryDate.toISOString()
        : null,
      user: {
        ...liveTalkItem.user,
        createdAt: liveTalkItem.user.createdAt.toISOString(),
        updatedAt: liveTalkItem.user.updatedAt.toISOString(),
        expiryDate: liveTalkItem.user.expiryDate
          ? liveTalkItem.user.expiryDate.toISOString()
          : null,
      },
    }));
    
    return {
      props: {
        liveTalks: formattedLiveTalks,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        liveTalks: [],
      },
    };
  }
}

export default Live;
