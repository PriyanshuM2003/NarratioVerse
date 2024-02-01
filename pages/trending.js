"use client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { listenNowAlbums, madeForYouAlbums } from "../data/albums";
import AlbumArtwork from "../components/album-artwork";

const Trending = () => {
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
                      Top picks for you. Updated daily.
                    </p>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="relative">
                  <ScrollArea>
                    <div className="flex space-x-4 pb-4">
                      {listenNowAlbums.map((album) => (
                        <AlbumArtwork
                          key={album.name}
                          album={album}
                          className="w-[250px]"
                          aspectRatio="portrait"
                          width={250}
                          height={330}
                        />
                      ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
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
                      {madeForYouAlbums.map((album) => (
                        <AlbumArtwork
                          key={album.name}
                          album={album}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Trending;
