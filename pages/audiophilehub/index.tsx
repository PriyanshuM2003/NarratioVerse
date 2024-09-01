import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import {
  BookAudio,
  History,
  LayoutDashboard,
  PlusCircle,
  Podcast,
  Radio,
} from "lucide-react";
import Dashboard from "./audiophileHubTabContents/dashboard";
import LiveHistory from "./audiophileHubTabContents/liveHistory";
import YourAudiobooks from "./audiophileHubTabContents/youraudiobooks";
import YourPodcasts from "./audiophileHubTabContents/yourpodcasts";
import GoLive from "./audiophileHubTabContents/golive";
import AddAudio from "./audiophileHubTabContents/addaudio";
import { getAccessToken } from "@/lib/auth";

const AudiophileHub = () => {
  const router = useRouter();
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <>
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-gray-900 text-white sticky top-0 left-7 z-50">
          <TabsTrigger value="dashboard" className="gap-1">
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="add" className="gap-1">
            <PlusCircle className="w-5 h-5" />
            Add Audio
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-1">
            <Radio className="w-5 h-5" />
            Go Live
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="gap-1">
            <Podcast className="w-5 h-5" />
            Your Podcasts
          </TabsTrigger>
          <TabsTrigger value="audiobooks" className="gap-1">
            <BookAudio className="w-5 h-5" />
            Your Audio Books
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1">
            <History className="w-5 h-5" />
            Live History
          </TabsTrigger>
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

export default AudiophileHub;
{
  /* <div className="flex flex-wrap items-center justify-between space-y-2">
<h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
<div className="md:flex max-md:space-y-4 items-center md:space-x-2">
  <Search />
  <CalendarDateRangePicker />
</div>
</div> */
}
