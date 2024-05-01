"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";

const Live = () => {
  return (
    <>
      <div className="h-full px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              New Episodes
            </h2>
            <p className="text-sm text-muted-foreground">
              Your favorite podcasts. Updated daily.
            </p>
          </div>
        </div>
        <Separator className="my-4" />
      </div>
    </>
  );
};

export default Live;
