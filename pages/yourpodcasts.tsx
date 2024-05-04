"use client";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import Link from "next/link";
import { AudioLines, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Image from "next/image";

const YourPodcasts: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [podcasts, setPodcasts] = useState<any[]>([]);
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

  const handlePodcastSelect = (podcast: any, startIndex = 0) => {
    setAudioData(podcast);
    setCurrentIndex(startIndex);
    if (audioRef.current) {
      audioRef.current.src = podcast.parts[startIndex].audioUrl;
      audioRef.current.load();
      playPauseHandler();
    }
  };

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getuseraudios`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch podcasts");
        }

        const data = await response.json();
        const filteredAudioCategory = data.userAudio.filter(
          (podcast: any) => podcast.category === "Podcast"
        );
        setPodcasts(filteredAudioCategory);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch podcasts",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, [toast, router, setAudioData]);

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Your Podcasts</h2>
      </div>
      <Separator className="my-4" />
      {loading ? (
        Array.from({ length: 10 }, (_, index) => (
          <Skeleton
            key={index}
            className="h-10 w-full bg-gray-300 mb-4 rounded-md"
          />
        ))
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {podcasts.map((podcast) => (
            <AccordionItem key={podcast.id} value={`item-${podcast.id}`}>
              <AccordionTrigger
                className="flex justify-between items-center"
                onClick={() => toggleAccordionItem(`item-${podcast.id}`)}
              >
                <div
                  onClick={() => handlePodcastSelect(podcast)}
                  className="flex items-center"
                >
                  <Image
                    width={10}
                    height={10}
                    src={podcast.coverImage}
                    alt={podcast.title}
                    className="w-10 mr-4"
                  />
                  <p className="text-2xl hover:underline">{podcast.title}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Link href="#" className="text-sm hover:underline">
                    {podcast.genres.join(", ")}
                  </Link>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform duration-200 transform ${
                      expandedItem === `item-${podcast.id}` ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <ul>
                  {podcast.parts.map((part: any, index: number) => (
                    <li
                      className="flex items-center justify-between text-base"
                      key={part.partName}
                      onClick={() => handlePodcastSelect(podcast, index)}
                    >
                      <div className="flex items-center">
                        <span className="mr-2">{index + 1}.</span>
                        <div
                          className={`hover:underline cursor-pointer ${
                            index === currentIndex && isPlaying
                              ? "text-pink-500 font-semibold"
                              : ""
                          }`}
                        >
                          {part.partName}
                        </div>
                      </div>
                      {index === currentIndex && isPlaying && (
                        <AudioLines className="animate-pulse text-pink-500" />
                      )}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default YourPodcasts;
