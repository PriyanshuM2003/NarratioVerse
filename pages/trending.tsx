"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TrendingAudio from "@/components/trending/trendingAudio";
import { Audio, LiveTalk } from "@/types/types";
import TrendingLive from "@/components/trending/trendingLive";
import AudioMadeForYou from "@/components/trending/foryou";
import NewReleases from "@/components/trending/newReleases";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import GetMadeForYou from "@/routes/getMadeForYou";

const Trending = ({
  audio,
  newAudio,
  liveTalks,
  isLoggedIn,
}: {
  audio: Audio[];
  newAudio: Audio[];
  isLoggedIn: boolean;
  liveTalks: LiveTalk[];
}) => {
  const [madeForYou, setMadeForYou] = useState<any[]>([]);
  const { madeForYouData, loadingmadeforyou } = GetMadeForYou();

  useEffect(() => {
    if (madeForYouData) {
      setMadeForYou(madeForYouData);
    }
  }, [madeForYouData]);

  return (
    <>
      <div className="bg-gray-800 text-white">
        <div className="grid grid-cols-3 lg:grid-cols-4">
          <div className="col-span-3 lg:col-span-4">
            <div className="min-h-screen px-4 py-6 lg:px-8">
              <div className="border-none p-0 space-y-4 outline-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Listen Now
                    </h2>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {audio?.map(
                        (item, index) =>
                          index < 20 && (
                            <TrendingAudio key={item.id} audioItem={item} />
                          )
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    New Releases
                  </h2>
                  <Link href="/new">
                    <h6 className="text-sm hover:underline-offset-2 hover:underline hover:text-white/50 text-muted-foreground">
                      Show all
                    </h6>
                  </Link>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {newAudio?.map(
                        (item, index) =>
                          index < 20 && (
                            <NewReleases key={item.id} audioItem={item} />
                          )
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                {liveTalks?.length > 0 && liveTalks[0]?.status && (
                  <>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Live Sessions
                      </h2>
                      <Link href="/live">
                        <h6 className="text-sm hover:underline-offset-2 hover:underline hover:text-white/50 text-muted-foreground">
                          Show all
                        </h6>
                      </Link>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ScrollArea>
                        <div className="flex space-x-4 pb-4">
                          {liveTalks?.map(
                            (item, index) =>
                              index < 20 && (
                                <TrendingLive key={item.id} liveItem={item} />
                              )
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  </>
                )}
                {isLoggedIn && (
                  <>
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Made for You
                      </h2>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ScrollArea>
                        <div className="flex space-x-4 pb-4">
                          {loadingmadeforyou ? (
                            Array.from({ length: 7 }, (_, index) => (
                              <Skeleton
                                key={index}
                                className="h-[150px] w-[150px] bg-gray-300 rounded-md"
                              />
                            ))
                          ) : (
                            <>
                              {madeForYou?.map((item) => (
                                <AudioMadeForYou
                                  key={item.id}
                                  audioItem={item}
                                />
                              ))}
                            </>
                          )}
                        </div>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trending;
