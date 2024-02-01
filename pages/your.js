import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

const Your = () => {
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
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Your Podcasts
              </h2>
            </div>
            <Separator className="my-4" />
          </TabsContent>
          <TabsContent value="audiobook">
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">
                Your Audio Books
              </h2>
            </div>
            <Separator className="my-4" />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Your;
