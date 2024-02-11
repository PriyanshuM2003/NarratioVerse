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
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioPlayer } from "@/components/AudioPlayerContext";
import Image from "next/image";

const YourPodcasts = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [podcasts, setPodcasts] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);
  const { setAudioData, setCurrentIndex, playPauseHandler, audioRef } =
    useAudioPlayer();

  const toggleAccordionItem = (value) => {
    setExpandedItem((prevItem) => (prevItem === value ? null : value));
  };

  const handlePodcastSelect = (podcast, startIndex = 0) => {
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
          (podcast) => podcast.category === "Podcast"
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
        <>
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
          <Skeleton className="h-6 w-full bg-gray-300 mb-4 rounded-md" />
        </>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {podcasts.map((podcast) => (
            <AccordionItem key={podcast.id} value={`item-${podcast.id}`}>
              <AccordionTrigger
                className="flex justify-between"
                onClick={() => toggleAccordionItem(`item-${podcast.id}`)}
              >
                <div
                  onClick={() => handlePodcastSelect(podcast)}
                  className="flex items-center"
                >
                  <Image
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
                <div>
                  <ul>
                    {podcast.parts.map((part, index) => (
                      <li
                        className="flex items-center text-base"
                        key={part.partName}
                        onClick={() => handlePodcastSelect(podcast, index)}
                      >
                        <span className="mr-2">{index + 1}.</span>
                        <div className="hover:underline cursor-pointer">
                          {part.partName}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </>
  );
};

export default YourPodcasts;
