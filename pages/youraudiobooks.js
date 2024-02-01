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

const YourAudiobooks = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [audiobooks, setAudiobooks] = useState([]);
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleAccordionItem = (value) => {
    setExpandedItem((prevItem) => (prevItem === value ? null : value));
  };

  useEffect(() => {
    const fetchAudiobooks = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getaudiobooks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch audiobooks");
        }

        const data = await response.json();
        setAudiobooks(data.audiobooks);
      } catch (error) {
        console.error("Error fetching audiobooks:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch audiobooks",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAudiobooks();
  }, [toast, router]);

  return (
    <>
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">
          Your Audio Books
        </h2>
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
          {audiobooks.map((audiobook) => (
            <AccordionItem key={audiobook.id} value={`item-${audiobook.id}`}>
              <AccordionTrigger
                className="flex justify-between"
                onClick={() => toggleAccordionItem(`item-${audiobook.id}`)}
              >
                <div className="flex items-center">
                  <img
                    src={audiobook.audiobookImage}
                    alt={audiobook.audiobookName}
                    className="w-10 mr-4"
                  />
                  <p className="text-2xl hover:underline">
                    {audiobook.audiobookName}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
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
                <div>
                  <ul>
                    {audiobook.audiobookParts.map((part, index) => (
                      <li
                        className="flex items-center text-base"
                        key={part.partName}
                      >
                        <span className="mr-2">{index + 1}.</span>
                        <Link href={part.audioUrl} className="hover:underline">
                          {part.partName}
                        </Link>
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

export default YourAudiobooks;
