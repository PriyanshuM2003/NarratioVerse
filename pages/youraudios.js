"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import YourPodcasts from "./yourpodcasts";
import YourAudiobooks from "./youraudiobooks";

const YourAudios = () => {
  const [selectedTab, setSelectedTab] = useState("podcast");

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  return (
    <>
      <div className="p-8 text-white">
        <Tabs defaultValue="podcast">
          <div className="mb-5 flex justify-center">
            <TabsList className="bg-gray-950 border-2 text-white">
              <TabsTrigger
                value="podcast"
                onClick={() => handleTabChange("podcast")}
                className={`relative ${
                  selectedTab === "podcast" ? "active" : ""
                }`}
              >
                Podcast
              </TabsTrigger>
              <TabsTrigger
                value="audiobook"
                onClick={() => handleTabChange("audiobook")}
                className={`relative ${
                  selectedTab === "audiobook" ? "active" : ""
                }`}
              >
                Audio Book
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="podcast">
            <YourPodcasts />
          </TabsContent>
          <TabsContent value="audiobook">
            <YourAudiobooks />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default YourAudios;
