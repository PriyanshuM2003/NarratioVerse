"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader, PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/data/preferences";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/lib/supabase";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Field {
  id: number;
  partName: string;
  file: File | null;
  audioUrl?: string;
}

interface AudioData {
  title: string;
  slug: string;
  coverImage: string;
  category: string;
  genres: string[];
  parts: {
    partName: string;
    audioUrl: string;
  }[];
}

const AddAudio: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Podcast");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [fields, setFields] = useState<Field[]>([
    {
      id: 1,
      partName: "",
      file: null,
    },
  ]);

  const [audioData, setAudioData] = useState<AudioData>({
    title: "",
    slug: "",
    coverImage: "",
    category: "",
    genres: [],
    parts: [],
  });

  const handleTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleGenreSelect = (selectedGenre: string) => {
    if (!selectedGenres.includes(selectedGenre)) {
      setSelectedGenres((prevGenres) => [...prevGenres, selectedGenre]);
    }
  };

  const handleGenreRemove = (genreToRemove: string) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  const handleAudioPartName = (
    event: ChangeEvent<HTMLInputElement>,
    fieldId: number
  ) => {
    const updatedFields = fields.map((field) =>
      field.id === fieldId ? { ...field, partName: event.target.value } : field
    );
    setFields(updatedFields);
  };

  const handleAddAudioDataPart = (e: FormEvent) => {
    e.preventDefault();
    const nextId = fields.length + 1;
    setFields((prevFields) => [
      ...prevFields,
      {
        id: nextId,
        partName: "",
        file: null,
      },
    ]);
  };

  const handleRemoveAudioPart = (fieldId: number) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
  };

  const clearFileInput = (selector: string) => {
    const fileInputs = document.querySelectorAll<HTMLInputElement>(selector);
    if (fileInputs) {
      fileInputs.forEach((input) => {
        input.value = "";
      });
    }
  };

  const handleAddAudioData = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      setLoading(true);
      const uniqueId = Math.random().toString(36).substring(7);
      const postData = {
        title,
        slug: `${uniqueId}-${category.toLowerCase()}-${title}-${fields
          .map((field) => field.partName)
          .join("+")}`,
        coverImage: audioData.coverImage,
        category,
        genres: selectedGenres,
        parts: fields.map((field) => ({
          partName: field.partName,
          audioUrl: field.audioUrl,
        })),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/adduseraudio`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(postData),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        toast({
          description: `${category} added successfully`,
        });
        setTitle("");
        setAudioData({
          title: "",
          slug: "",
          coverImage: "",
          category: "",
          genres: [],
          parts: [],
        });
        setSelectedGenres([]);
        setFields([
          {
            id: 1,
            partName: "",
            file: null,
          },
        ]);
        clearFileInput('input[type="file"]');
      } else {
        const errorText = await response.text();
        console.error("Error adding audio data:", errorText);
        toast({
          variant: "destructive",
          description: `Error adding ${category}`,
        });
      }
    } catch (error) {
      console.error(`Error adding ${category}:`, (error as Error).message);
      toast({
        variant: "destructive",
        description: `Error adding ${category}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlecoverImage = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        setLoading(true);
        const oldcoverImageFileName = audioData.coverImage.split("/").pop();
        if (oldcoverImageFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("Images")
              .remove([`${category}/${oldcoverImageFileName}`]);

          if (removeError) {
            console.error("Error removing old image:", removeError);
          } else {
            console.log("Old image removed successfully:", removeData);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(`${category}/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading cover image",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("Images")
            .getPublicUrl(`${category}/${uniqueId}_${file.name}`);
          setAudioData({
            ...audioData,
            coverImage: downloadUrl.data.publicUrl,
          });
          toast({
            description: "Cover image uploaded successfully",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error uploading cover image",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAudioParts = async (
    e: ChangeEvent<HTMLInputElement>,
    fieldId: number
  ) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        setLoading(true);

        const oldAudioFileName = fields.find((field) => field.id === fieldId)
          ?.file?.name;

        if (oldAudioFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("AudioFiles")
              .remove([`${category}/${oldAudioFileName}`]);

          if (removeError) {
            console.error("Error removing old audio file:", removeError);
          } else {
            console.log("Old audio removed successfully:", removeData);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("AudioFiles")
          .upload(`${category}/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading audio file",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("AudioFiles")
            .getPublicUrl(`${category}/${uniqueId}_${file.name}`);

          const updatedFields = fields.map((field) =>
            field.id === fieldId
              ? { ...field, file: file, audioUrl: downloadUrl.data.publicUrl }
              : field
          );

          setFields(updatedFields);

          toast({
            description: "Audio file uploaded successfully",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error uploading audio file",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="px-8 pb-4 min-h-screen text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Add {String(category)}
          </h2>
        </div>
        <Separator className="my-4" />
        <div className="mb-5 flex justify-center ">
          <div className="w-full px-4">
            <form>
              <div className="w-full md:w-1/2 flex items-center space-x-4 mb-6">
                <Label htmlFor="category">Select Category:</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="radio"
                    id="podcast"
                    name="category"
                    value="Podcast"
                    checked={category === "Podcast"}
                    onChange={() => setCategory("Podcast")}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="podcast">Podcast</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <Input
                    type="radio"
                    id="audiobook"
                    name="category"
                    value="Audiobook"
                    checked={category === "Audiobook"}
                    onChange={() => setCategory("Audiobook")}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="audiobook">Audiobook</Label>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-6 text-white">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    name="title"
                    id="title"
                    value={title}
                    onChange={handleTitle}
                    type="text"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <Label htmlFor="coverImage">
                    Upload {String(category)} Cover Image
                  </Label>
                  <Input
                    className="text-black cursor-pointer bg-gray-50"
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    onChange={handlecoverImage}
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full text-white px-3 mb-6">
                  <Label>Genres</Label>
                  <div className="flex items-center space-x-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="text-black">
                          Select Genres
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <ScrollArea className="h-72">
                          {genres.map((genre) => (
                            <DropdownMenuItem
                              key={genre.id}
                              onSelect={() => handleGenreSelect(genre.label)}
                            >
                              {genre.label}
                            </DropdownMenuItem>
                          ))}
                        </ScrollArea>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {selectedGenres.length > 0 && (
                      <div className="flex flex-wrap space-x-1 space-y-1">
                        {selectedGenres.map((selectedGenre) => (
                          <Badge
                            key={selectedGenre}
                            className="px-4 text-sm cursor-pointer"
                          >
                            {selectedGenre}&nbsp;
                            <span
                              className="text-lg"
                              onClick={() => handleGenreRemove(selectedGenre)}
                            >
                              &times;
                            </span>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center text-white mb-2">
                {fields.map((field, index) => (
                  <div
                    className="w-full md:w-1/2 flex items-center mb-6"
                    key={field.id}
                  >
                    <div className="w-full mr-1">
                      <Label htmlFor={`partName-${field.id}`}>{`${String(
                        category
                      )} Part ${index + 1} Name`}</Label>
                      <Input
                        name={`partName-${field.id}`}
                        id={`partName-${field.id}`}
                        value={field.partName}
                        onChange={(event) =>
                          handleAudioPartName(event, field.id)
                        }
                        type="text"
                      />
                    </div>
                    <div className="w-full mr-1">
                      <Label htmlFor={`file-${field.id}`}>{`Upload Audio Part ${
                        index + 1
                      }`}</Label>
                      <div className="flex items-center space-x-1">
                        <Input
                          className="text-black cursor-pointer bg-gray-50"
                          id={`file-${field.id}`}
                          type="file"
                          onChange={(e) => handleAudioParts(e, field.id)}
                        />
                        {field.id !== fields[0].id && (
                          <Button
                            onClick={() => handleRemoveAudioPart(field.id)}
                          >
                            <X color="#ffffff" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                <Button onClick={handleAddAudioDataPart}>
                  <PlusCircle color="#ffffff" />
                  &nbsp;Add Field
                </Button>
              </div>
              <div className="flex mx-auto items-center justify-center mt-4">
                <Button onClick={handleAddAudioData}>
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      &nbsp;Add&nbsp;{String(category)}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAudio;
