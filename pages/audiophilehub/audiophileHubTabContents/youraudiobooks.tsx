"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { AudioLines, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Image from "next/image";
import GetUserAudioData from "@/routes/getUserAudioData";

const YourAudiobooks = () => {
  const [audiobooks, setAudiobooks] = useState<any[]>([]);
  const { loadingAudioData, UserAudioBookData } = GetUserAudioData();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const {
    setAudioData,
    setCurrentIndex,
    playPauseHandler,
    audioRef,
    currentIndex,
    isPlaying,
  } = useAudioPlayer();

  const toggleAccordionItem = (value: string) => {
    setExpandedItem((prevItem) => (prevItem === value ? null : value));
  };

  const handleAudioSelect = (audiobook: any, startIndex = 0) => {
    setAudioData(audiobook);
    setCurrentIndex(startIndex);
    if (audioRef.current) {
      audioRef.current.src = audiobook.parts[startIndex].audioUrl;
      audioRef.current.load();
      playPauseHandler();
    }
  };

  useEffect(() => {
    if (UserAudioBookData) {
      setAudiobooks(UserAudioBookData);
    }
  }, [UserAudioBookData]);

  return (
    <>
      <div className="min-h-screen px-8 pb-4 text-white">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Your Audio Books
          </h2>
        </div>
        <Separator className="my-4" />
        {loadingAudioData ? (
          Array.from({ length: 10 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-full bg-gray-300 mb-4 rounded-md"
            />
          ))
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {audiobooks.map((audiobook) => (
              <AccordionItem key={audiobook.id} value={`item-${audiobook.id}`}>
                <AccordionTrigger
                  className="flex justify-between"
                  onClick={() => toggleAccordionItem(`item-${audiobook.id}`)}
                >
                  <div
                    onClick={() => handleAudioSelect(audiobook)}
                    className="flex items-center"
                  >
                    <Image
                      width={16}
                      height={16}
                      src={audiobook.coverImage}
                      alt={audiobook.title}
                      className="w-16 mr-4"
                    />
                    <p className="text-2xl hover:underline">
                      {audiobook.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p>Total Streams:&nbsp;{audiobook.streams}</p>
                    <Link href="#" className="text-sm hover:underline">
                      {audiobook.genres.join(", ")}
                    </Link>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 transform ${
                        expandedItem === `item-${audiobook.id}`
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul>
                    {audiobook.parts.map((part: any, index: number) => (
                      <li
                        className="flex items-center justify-between text-base"
                        key={part.partName}
                        onClick={() => handleAudioSelect(audiobook, index)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{index + 1}.</span>
                          <div
                            className={`hover:underline cursor-pointer ${
                              index === currentIndex &&
                              part.partName &&
                              isPlaying
                                ? "text-pink-600 font-semibold"
                                : ""
                            }`}
                          >
                            {part.partName}
                          </div>
                        </div>
                        {index === currentIndex &&
                          part.partName &&
                          isPlaying && (
                            <AudioLines className="animate-pulse text-pink-600" />
                          )}
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
};

export default YourAudiobooks;
