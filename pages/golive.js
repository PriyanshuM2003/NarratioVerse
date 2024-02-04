"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Radio } from "lucide-react";

const GoLive = () => {
  return (
    <>
      <div className="p-8 min-h-screen text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Go Live</h2>
        </div>
        <Separator className="my-4" />
        <div className="">
          <Button size="sm">
            <Radio className="w-4 h-4" />
            &nbsp;Go Live
          </Button>
        </div>
      </div>
    </>
  );
};

export default GoLive;
