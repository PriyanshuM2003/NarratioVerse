"use client";
import React, { useEffect } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import { LayoutDashboard } from "lucide-react";
import Dashboard from "./audiophileAlleyTabContents/dashboard";
import LiveHistory from "./audiophileAlleyTabContents/liveHistory";
import YourAudiobooks from "./audiophileAlleyTabContents/youraudiobooks";
import YourPodcasts from "./audiophileAlleyTabContents/yourpodcasts";
import GoLive from "./audiophileAlleyTabContents/golive";
import AddAudio from "./audiophileAlleyTabContents/addaudio";

const AudiophileAlley = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-gray-950 text-white sticky top-0 left-7">
          <TabsTrigger value="dashboard" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="add">Add Audio</TabsTrigger>
          <TabsTrigger value="live">Go Live</TabsTrigger>
          <TabsTrigger value="podcasts">Your Podcasts</TabsTrigger>
          <TabsTrigger value="audiobooks">Your Audio Books</TabsTrigger>
          <TabsTrigger value="history">Live History</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <Dashboard />
        </TabsContent>
        <TabsContent value="add">
          <AddAudio />
        </TabsContent>
        <TabsContent value="live">
          <GoLive />
        </TabsContent>
        <TabsContent value="podcasts">
          <YourPodcasts />
        </TabsContent>
        <TabsContent value="audiobooks">
          <YourAudiobooks />
        </TabsContent>
        <TabsContent value="history">
          <LiveHistory />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default AudiophileAlley;
{
  /* <div className="flex flex-wrap items-center justify-between space-y-2">
<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
<div className="md:flex max-md:space-y-4 items-center md:space-x-2">
  <Search />
  <CalendarDateRangePicker />
</div>
</div> */
}
