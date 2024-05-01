"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import TrendingAudio from "@/components/trending/trendingAudio";
import { Audio, LiveTalk } from "@/types/trendingTypes";
import TrendingLive from "@/components/trending/trendingLive";
import AudioMadeForYou from "@/components/trending/foryou";

const Trending = ({
  audio,
  liveTalks,
  isLoggedIn,
}: {
  audio: Audio[];
  isLoggedIn: boolean;
  liveTalks: LiveTalk[];
}) => {
  const [madeForYouData, setMadeForYouData] = useState<Audio[]>([]);
  useEffect(() => {
    const fetchPreferenceData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/madeforyou`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Unauthorized");
        }

        const data = await response.json();
        setMadeForYouData(data);
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferenceData();
  }, []);

  return (
    <>
      <div className="bg-gray-800 text-white">
        <div className="grid grid-cols-3 lg:grid-cols-4">
          <div className="col-span-3 lg:col-span-4">
            <div className="h-full px-4 py-6 lg:px-8">
              <div className="border-none p-0 outline-none">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      Listen Now
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Top trends today. Updated daily.
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {audio?.map(
                        (item, index) =>
                          index < 20 && (
                            <TrendingAudio
                              key={item.id}
                              audioItem={item}
                              className="w-[150px]"
                              aspectRatio="portrait"
                              width={150}
                              height={230}
                            />
                          )
                      )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
                {liveTalks.length > 0 && liveTalks[0].status && (
                  <>
                    <div className="mt-6 space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Live Podcast sessions
                      </h2>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ScrollArea>
                        <div className="flex space-x-4 pb-4">
                          {liveTalks?.map(
                            (item, index) =>
                              index < 20 && (
                                <TrendingLive
                                  key={item.id}
                                  liveItem={item}
                                  className="w-[150px]"
                                  aspectRatio="square"
                                  width={150}
                                  height={150}
                                />
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
                    <div className="mt-6 space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Made for You
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Your personal playlists. Updated daily.
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div className="relative">
                      <ScrollArea>
                        <div className="flex space-x-4 pb-4">
                          {madeForYouData?.map((item) => (
                            <AudioMadeForYou
                              key={item.id}
                              audioItem={item}
                              className="w-[150px]"
                              aspectRatio="square"
                              width={150}
                              height={150}
                            />
                          ))}
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
