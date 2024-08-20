import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AudioLines,
  ChevronDown,
  FileMusic,
  FilePen,
  Trash2,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { useAudioPlayer } from "@/context/AudioPlayerContext";
import Image from "next/image";
import AudioDeleteAlert from "@/components/dialogs/audioDeleteAlert";
import AudioPartDeleteAlert from "@/components/dialogs/audioPartDeleteAlert";
import { Audio } from "@/types/types";
import EditAboutDialog from "../dialogs/editAboutDialog";
import AddAudioPartDialog from "../dialogs/addAudioPartDialog";

interface yourAudioProps {
  section: string;
  loading: boolean;
  audios: Audio[];
}

const YourAudio = ({ section, audios, loading }: yourAudioProps) => {
  const [expandedItem, setExpandedItem] = useState<string | undefined>(
    undefined
  );
  const [addAudioPartDialogOpen, setAddAudioPartDialogOpen] = useState(false);
  const [editAboutDialogOpen, setEditAboutDialogOpen] = useState(false);
  const [audioDeleteAlertOpen, setAudioDeleteAlertOpen] = useState(false);
  const {
    setAudioData,
    setCurrentIndex,
    playPauseHandler,
    audioRef,
    currentIndex,
    isPlaying,
  } = useAudioPlayer();

  const handleAudioSelect = (audio: any, startIndex = 0) => {
    setAudioData(audio);
    setCurrentIndex(startIndex);
    if (audioRef.current) {
      audioRef.current.src = audio.parts[startIndex].audioUrl;
      audioRef.current.load();
      playPauseHandler();
    }
  };

  const handleAccordionToggle = (itemId: string | undefined) => {
    setExpandedItem(expandedItem === itemId ? undefined : itemId);
  };

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      <div className="min-h-screen px-8 pb-4 text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Your&nbsp;{section}
          </h2>
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
          <Accordion
            type="single"
            value={expandedItem}
            onValueChange={handleAccordionToggle}
            collapsible
            className="w-full"
          >
            {audios.map((audio) => (
              <AccordionItem key={audio.id} value={`item-${audio.id}`}>
                <AccordionTrigger>
                  <div
                    onClick={() => handleAudioSelect(audio)}
                    className="flex items-center"
                  >
                    <Image
                      width={16}
                      height={16}
                      src={audio.coverImage}
                      alt={audio.title}
                      className="w-16 mr-4"
                    />
                    <p className="text-2xl">{audio.title}</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p>Total Streams:&nbsp;{audio.streams}</p>
                    <span className="text-sm">{audio.genres.join(", ")}</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <FilePen
                          onClick={(e) => {
                            handleIconClick(e);
                            setEditAboutDialogOpen(true);
                          }}
                          className="w-5 h-5 hover:text-pink-600"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit About this</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <FileMusic
                          onClick={(e) => {
                            handleIconClick(e);
                            setAddAudioPartDialogOpen(true);
                          }}
                          className="w-5 h-5 hover:text-pink-600"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add Audio Part</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Trash2
                          onClick={(e) => {
                            handleIconClick(e);
                            setAudioDeleteAlertOpen(true);
                          }}
                          className="w-5 h-5 hover:text-pink-600"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete Audio</p>
                      </TooltipContent>
                    </Tooltip>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 transition-transform duration-200 transform ${
                        expandedItem === `item-${audio.id}` ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="grid grid-cols-2 gap-4">
                  <p>{audio.about}</p>
                  <ul>
                    {audio.parts.map((part: any, index: number) => (
                      <li
                        className="flex items-center space-y-2 justify-between text-base"
                        key={part.partName}
                        onClick={() => handleAudioSelect(audio, index)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{index + 1}.</span>
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
                        <div className="flex items-center gap-4">
                          <AudioPartDeleteAlert
                            audioId={audio.id}
                            partName={part.partName}
                            audioURL={part.audioUrl}
                          />
                          {index === currentIndex &&
                            part.partName &&
                            isPlaying && (
                              <AudioLines className="animate-pulse text-pink-600" />
                            )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
                {editAboutDialogOpen && (
                  <EditAboutDialog
                    editAboutDialogOpen={editAboutDialogOpen}
                    setEditAboutDialogOpen={setEditAboutDialogOpen}
                  />
                )}
                {addAudioPartDialogOpen && (
                  <AddAudioPartDialog
                    addAudioPartDialogOpen={addAudioPartDialogOpen}
                    setAddAudioPartDialogOpen={setAddAudioPartDialogOpen}
                  />
                )}
                {audioDeleteAlertOpen && (
                  <AudioDeleteAlert
                    audioDeleteAlertOpen={audioDeleteAlertOpen}
                    setAudioDeleteAlertOpen={setAudioDeleteAlertOpen}
                    audioId={audio.id}
                  />
                )}
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </>
  );
};

export default YourAudio;
