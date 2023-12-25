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

const Preferences = () => {
  const language = [
    {
      id: "Hindi",
      label: "Hindi",
    },
    {
      id: "English",
      label: "English",
    },
    {
      id: "Sanskrit",
      label: "Sanskrit",
    },
    {
      id: "Punjabi",
      label: "Punjabi",
    },
    {
      id: "Marathi",
      label: "Marathi",
    },
    {
      id: "Tamil",
      label: "Tamil",
    },
  ];
  const genre = [
    {
      id: "Action",
      label: "Action",
    },
    {
      id: "Romance",
      label: "Romance",
    },
    {
      id: "Motivation",
      label: "Motivation",
    },
    {
      id: "Culture",
      label: "Culture",
    },
    {
      id: "Regional",
      label: "Regional",
    },
    {
      id: "Horror",
      label: "Horror",
    },
  ];
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
          <div className="flex items-start flex-col space-y-2">
            {genre.map((gen) => (
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
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </>
  );
};

export default Preferences;
