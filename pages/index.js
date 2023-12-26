"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import Head from "next/head";
import playlists from "../data/playlists";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Listen from "./listen";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { PlayCircle, PlusCircle, Podcast, Search } from "lucide-react";
import AddPodcast from "./addpodcast";
import AddAudioBook from "./addaudiobook";
import GoLive from "./golive";

export default function Home() {
  const [selectedTab, setSelectedTab] = useState("listen");

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  return (
    <>
      <Head>
        <title>Narratioverse</title>
        <meta name="description" content="Narratioverse" />
        <link rel="icon" href="/logo.png" />
      </Head>
      <Tabs defaultValue="listen" className="h-full space-y-6">
        <main className="flex">
          <div className="text-white border-r-2 w-52 bg-gray-900">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Discover
              </h2>
              <TabsList className="flex-nowrap flex-col space-y-2 text-white">
                <TabsTrigger
                  value="listen"
                  onClick={() => handleTabChange("listen")}
                  className="w-full justify-start"
                >
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Listen Now
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  onClick={() => handleTabChange("search")}
                  className="w-full justify-start"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </TabsTrigger>
                <TabsTrigger
                  value="golive"
                  onClick={() => handleTabChange("golive")}
                  className="w-full justify-start"
                >
                  <Podcast className="w-4 h-4 mr-2" />
                  Go Live
                </TabsTrigger>
                <TabsTrigger
                  value="addpodcast"
                  onClick={() => handleTabChange("addpodcast")}
                  className="w-full justify-start"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Podcast
                </TabsTrigger>
                <TabsTrigger
                  value="addaudiobook"
                  onClick={() => handleTabChange("addaudiobook")}
                  className="w-full justify-start"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Audio Book
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                Library
              </h2>
              <TabsList className="flex-nowrap flex-col space-y-2 text-white">
                <TabsTrigger
                  value="playlists"
                  onClick={() => handleTabChange("playlists")}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M21 15V6" />
                    <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                    <path d="M12 12H3" />
                    <path d="M16 6H3" />
                    <path d="M12 18H3" />
                  </svg>
                  Playlists
                </TabsTrigger>
                <TabsTrigger
                  value="songs"
                  onClick={() => handleTabChange("songs")}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <circle cx="8" cy="18" r="4" />
                    <path d="M12 18V2l7 4" />
                  </svg>
                  Songs
                </TabsTrigger>
                <TabsTrigger
                  value="mfy"
                  onClick={() => handleTabChange("mfy")}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Made for You
                </TabsTrigger>
                <TabsTrigger
                  value="artists"
                  onClick={() => handleTabChange("artists")}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                    <circle cx="17" cy="7" r="5" />
                  </svg>
                  Artists
                </TabsTrigger>
                <TabsTrigger
                  value="albums"
                  onClick={() => handleTabChange("listen")}
                  className="w-full justify-start"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="m16 6 4 14" />
                    <path d="M12 6v14" />
                    <path d="M8 8v12" />
                    <path d="M4 4v16" />
                  </svg>
                  Albums
                </TabsTrigger>
              </TabsList>
            </div>
            <Separator />
            <div className="py-2">
              <h2 className="relative px-7 text-lg font-semibold tracking-tight">
                Playlists
              </h2>
              <ScrollArea className="h-[300px] px-1">
                <TabsList className="flex-nowrap flex-col space-y-1 p-2 text-white">
                  {playlists?.map((playlist, i) => (
                    <TabsTrigger
                      key={`${playlist}-${i}`}
                      value={playlist}
                      onClick={() => handleTabChange({ playlist })}
                      className="w-full justify-start font-normal"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2 h-4 w-4"
                      >
                        <path d="M21 15V6" />
                        <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                        <path d="M12 12H3" />
                        <path d="M16 6H3" />
                        <path d="M12 18H3" />
                      </svg>
                      {playlist}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>
          </div>
          <div className="flex-1">
            <TabsContent value="listen">
              {selectedTab === "listen" && <Listen />}
            </TabsContent>
            <TabsContent value="golive">
              {selectedTab === "golive" && <GoLive />}
            </TabsContent>
            <TabsContent value="addpodcast">
              {selectedTab === "addpodcast" && <AddPodcast />}
            </TabsContent>
            <TabsContent value="addaudiobook">
              {selectedTab === "addaudiobook" && <AddAudioBook />}
            </TabsContent>
          </div>
        </main>
      </Tabs>
    </>
  );
}
