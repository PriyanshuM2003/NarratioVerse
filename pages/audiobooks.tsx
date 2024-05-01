"use client";
import { Separator } from "@/components/ui/separator";
import React from "react";

const AudioBooks = () => {
  return (
    <>
      <div className="h-full px-4 py-6 lg:px-8 text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Audio Books
            </h2>
          </div>
        </div>
        <Separator className="my-4" />
      </div>
    </>
  );
};

export default AudioBooks;
