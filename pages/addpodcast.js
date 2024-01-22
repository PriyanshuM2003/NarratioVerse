"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const AddPodcast = () => {
  return (
    <>
      <div className="p-8 text-white">
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
          <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <Button size="sm" className="relative">
              Add Podcast
            </Button>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Podcasts
          </h2>
        </div>
        <Separator className="my-4" />
      </div>
    </>
  );
};

export default AddPodcast;
