"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { language, genres } from "@/data/preferences";
import { ScrollArea } from "@/components/ui/scroll-area";

const Preferences = () => {
  return (
    <>
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Choose Language and genre of your interest.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-evenly">
          <ScrollArea className="h-[300px] px-1">
            <div className="flex items-start flex-col space-y-2">
              {language.map((lang) => (
                <div key={lang.id} className="space-x-2">
                  <Checkbox id={lang.id} />
                  <Label
                    htmlFor={lang.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {lang.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
          <ScrollArea className="h-[300px] px-1">
            <div className="flex items-start flex-col space-y-2">
              {genres.map((gen) => (
                <div key={gen.id} className="space-x-2">
                  <Checkbox id={gen.id} />
                  <Label
                    htmlFor={gen.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {gen.label}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default Preferences;
