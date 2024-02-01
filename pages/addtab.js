"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRouter } from "next/router";
import AddPodcast from "./addpodcast";
import AddAudiobook from "./addaudiobook";

const AddTab = () => {
  const router = useRouter();
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

          <div className="w-full px-4">
            <form>
              <TabsContent value="podcast">
                <AddPodcast />
              </TabsContent>
              <TabsContent value="audiobook">
                <AddAudiobook />
              </TabsContent>
            </form>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default AddTab;
