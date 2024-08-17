"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { language, genres } from "@/data/preferences";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "./ui/use-toast";
import GetUserPreferences from "@/routes/getUserPreferences";
import { Loader } from "lucide-react";
import GetMadeForYou from "@/routes/getMadeForYou";
import { getAccessToken } from "@/lib/auth";

interface Language {
  id: string;
  label: string;
}

interface Genre {
  id: string;
  label: string;
}

interface PreferencesProps {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen: boolean;
  SavePreferences: (languages: string[], genres: string[]) => void;
}

const Preferences = ({
  dialogOpen,
  setDialogOpen,
  SavePreferences,
}: PreferencesProps) => {
  const [preferenceData, setPreferenceData] = useState<any>();
  const { userPreferenceData, loadingUserPreferences } = GetUserPreferences();
  const { refreshMadeForYou } = GetMadeForYou();
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleLanguageSelection = (label: string) => {
    setSelectedLanguages((prevLanguages) => {
      if (prevLanguages.includes(label)) {
        return prevLanguages.filter((item) => item !== label);
      } else {
        return [...prevLanguages, label];
      }
    });
  };

  const toggleGenreSelection = (label: string) => {
    setSelectedGenres((prevGenres) => {
      if (prevGenres.includes(label)) {
        return prevGenres.filter((item) => item !== label);
      } else {
        return [...prevGenres, label];
      }
    });
  };

  const handleSavePreferences = () => {
    SavePreferences(selectedLanguages, selectedGenres);
    setDialogOpen(false);
  };

  useEffect(() => {
    if (userPreferenceData) {
      setPreferenceData(userPreferenceData);
      setSelectedLanguages(userPreferenceData.languages);
      setSelectedGenres(userPreferenceData.genres);
    }
  }, [userPreferenceData]);

  const handleUpdatePreferences = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/updatepreferences`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: preferenceData.id,
            languages: selectedLanguages,
            genres: selectedGenres,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save preferences");
      }
      toast({
        description: "Preferences saved successfully",
      });
      refreshMadeForYou();
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={(val) => setDialogOpen(val)}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-[375px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Preferences</DialogTitle>
            {getAccessToken() && loadingUserPreferences && (
              <Loader className="animate-spin" />
            )}
          </div>
          <DialogDescription>
            Choose Language and genre of your interest.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2">
          <ScrollArea className="h-[300px] pr-4">
            <div className="flex items-start flex-col space-y-2">
              {language.map((lang: Language) => (
                <div key={lang.id} className="space-x-2">
                  <Checkbox
                    id={lang.id}
                    checked={selectedLanguages.includes(lang.label)}
                    onClick={() => toggleLanguageSelection(lang.label)}
                  />
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
          <ScrollArea className="h-[300px] pr-4">
            <div className="flex items-start flex-col space-y-2">
              {genres.map((gen: Genre) => (
                <div key={gen.id} className="space-x-2">
                  <Checkbox
                    id={gen.id}
                    checked={selectedGenres.includes(gen.label)}
                    onClick={() => toggleGenreSelection(gen.label)}
                  />
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
          <Button
            variant={"ghost"}
            onClick={
              getAccessToken() ? handleUpdatePreferences : handleSavePreferences
            }
            type="submit"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default Preferences;
