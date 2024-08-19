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
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAccessToken } from "@/lib/auth";
import { Textarea } from "@/components/ui/textarea";

interface AudioData {
  title: string;
  coverImage: string;
  about: string;
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
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [audioFiles, setAudioFiles] = useState<(File | null)[]>([]);
  const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    about: z.string().min(1, { message: "About is required." }),
    category: z.string().min(1, { message: "Category is required." }),
    coverImage: z
      .string()
      .url()
      .min(1, { message: "Cover Image is required." }),
    genres: z
      .array(z.string())
      .min(1, { message: "At least 1 genre must be selected." }),
    parts: z
      .array(
        z.object({
          partName: z.string().min(1, { message: "Part name is required." }),
          audioUrl: z
            .string()
            .url()
            .min(1, { message: "Audio file is required." }),
        })
      )
      .min(1, { message: "At least one part is required." }),
  });

  const formMethods = useForm<AudioData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      coverImage: "",
      about: "",
      category: "Podcast",
      genres: [],
      parts: [{ partName: "", audioUrl: "" }],
    },
  });

  const resetForm = () => {
    formMethods.reset({
      title: "",
      about: "",
      coverImage: "",
      category: "Podcast",
      genres: [],
      parts: [{ partName: "", audioUrl: "" }],
    });
    setSelectedGenres([]);
    setCoverImageFile(null);
    setAudioFiles([]);
    clearFileInput('input[type="file"]');
  };

  const { control, handleSubmit, setValue, watch, register } = formMethods;
  const category = watch("category");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "parts",
  });

  const handleGenreSelect = (selectedGenre: string) => {
    if (!selectedGenres.includes(selectedGenre)) {
      const updatedGenres = [...selectedGenres, selectedGenre];
      setSelectedGenres(updatedGenres);
      setValue("genres", updatedGenres, { shouldValidate: true });
    }
  };

  const handleGenreRemove = (genreToRemove: string) => {
    const updatedGenres = selectedGenres.filter(
      (genre) => genre !== genreToRemove
    );
    setSelectedGenres(updatedGenres);
    setValue("genres", updatedGenres, { shouldValidate: true });
  };

  const handleAddAudioDataPart = () => {
    append({ partName: "", audioUrl: "" });
    setAudioFiles((prevFiles) => [...prevFiles, null]);
  };

  const handleRemoveAudioPart = (index: number) => {
    remove(index);
    setAudioFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearFileInput = (selector: string) => {
    const fileInputs = document.querySelectorAll<HTMLInputElement>(selector);
    fileInputs.forEach((input) => {
      input.value = "";
    });
  };

  const handleAddAudioData: SubmitHandler<AudioData> = async (data) => {
    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }
      setLoading(true);
      let coverImageUrl = "";
      if (coverImageFile) {
        const uniqueId = Math.random().toString(36).substring(7);
        const { data: imageData, error: imageError } = await supabase.storage
          .from("Images")
          .upload(
            `${data.category}/${uniqueId}_${coverImageFile.name}`,
            coverImageFile
          );

        if (imageError) {
          toast({
            variant: "destructive",
            description: "Error uploading cover image",
          });
          return;
        }
        const downloadUrl = await supabase.storage
          .from("Images")
          .getPublicUrl(`${data.category}/${uniqueId}_${coverImageFile.name}`);
        coverImageUrl = downloadUrl.data.publicUrl;
      }

      const audioUrls = await Promise.all(
        audioFiles.map(async (file, index) => {
          if (file) {
            const uniqueId = Math.random().toString(36).substring(7);
            const { data: audioData, error: audioError } =
              await supabase.storage
                .from("AudioFiles")
                .upload(`${data.category}/${uniqueId}_${file.name}`, file);

            if (audioError) {
              toast({
                variant: "destructive",
                description: `Error uploading audio file ${index + 1}`,
              });
              return "";
            }

            const downloadUrl = await supabase.storage
              .from("AudioFiles")
              .getPublicUrl(`${data.category}/${uniqueId}_${file.name}`);
            return downloadUrl.data.publicUrl;
          }
          return "";
        })
      );

      const postData = {
        ...data,
        coverImage: coverImageUrl,
        parts: data.parts.map((part, index) => ({
          ...part,
          audioUrl: audioUrls[index],
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
          description: `${data.category} added successfully`,
        });
        resetForm();
      } else {
        const errorText = await response.text();
        console.error("Error adding audio data:", errorText);
        toast({
          variant: "destructive",
          description: `Error adding ${data.category}`,
        });
      }
    } catch (error) {
      console.error(`Error adding ${data.category}:`, (error as Error).message);
      toast({
        variant: "destructive",
        description: `Error adding ${data.category}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCoverImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      setValue("coverImage", URL.createObjectURL(file), {
        shouldValidate: true,
      });
    }
  };

  const handleAudioPartsChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFiles((prev) => {
        const updatedFiles = [...prev];
        updatedFiles[index] = file;
        return updatedFiles;
      });
      setValue(`parts.${index}.audioUrl`, URL.createObjectURL(file), {
        shouldValidate: true,
      });
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
            <Form {...formMethods}>
              <form
                onSubmit={handleSubmit(handleAddAudioData)}
                className="space-y-4"
              >
                <div className="flex items-center gap-4">
                  <Label htmlFor="category">Select Category:</Label>
                  <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-1">
                        <FormLabel>Podcast</FormLabel>
                        <FormControl>
                          <Input
                            type="radio"
                            value={"Podcast"}
                            checked={category === "Podcast"}
                            {...register("category")}
                            className="h-5 w-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="category"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-1">
                        <FormLabel>Audiobook</FormLabel>
                        <FormControl>
                          <Input
                            type="radio"
                            value={"Audiobook"}
                            checked={category === "Audiobook"}
                            {...register("category")}
                            className="h-5 w-5"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Upload {String(category)} Cover Image
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverImageChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={control}
                  name="about"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>About this {String(category)}</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="genres"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Genres</FormLabel>
                      <div className="flex flex-wrap items-center gap-2">
                        <FormControl>
                          <DropdownMenu>
                            <DropdownMenuTrigger className="w-max" asChild>
                              <Button variant="outline" className="text-black">
                                Select Genres
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <ScrollArea className="h-72">
                                {genres.map((genre) => (
                                  <DropdownMenuItem
                                    key={genre.id}
                                    onSelect={() =>
                                      handleGenreSelect(genre.label)
                                    }
                                  >
                                    {genre.label}
                                  </DropdownMenuItem>
                                ))}
                              </ScrollArea>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </FormControl>
                        {selectedGenres.map((genre) => (
                          <Badge
                            key={genre}
                            className="cursor-pointer h-8 gap-2"
                          >
                            {genre}
                            <X
                              size={16}
                              onClick={() => handleGenreRemove(genre)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-wrap items-center text-white gap-2">
                  <FormField
                    control={control}
                    name="parts"
                    render={({ field }) => (
                      <>
                        {fields.map((field, index) => (
                          <div
                            key={field.id}
                            className="flex items-center gap-2"
                          >
                            <FormItem>
                              <FormLabel>
                                {String(category)} Part {index + 1} Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="w-[17.8rem]"
                                  {...register(`parts.${index}.partName`)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                            <FormItem>
                              <FormLabel>Audio File {index + 1}</FormLabel>
                              <div className="flex items-center gap-2">
                                <FormControl>
                                  <Input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                      handleAudioPartsChange(e, index)
                                    }
                                  />
                                </FormControl>
                                {field.id !== fields[0].id && (
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => handleRemoveAudioPart(index)}
                                    disabled={fields.length === 1}
                                  >
                                    <X color="#ffffff" />
                                  </Button>
                                )}
                              </div>
                              <FormMessage />
                            </FormItem>
                          </div>
                        ))}
                      </>
                    )}
                  />
                  <div className="mt-8">
                    <Button
                      type="button"
                      onClick={handleAddAudioDataPart}
                      disabled={loading}
                    >
                      <PlusCircle color="#ffffff" />
                      &nbsp;Add Field
                    </Button>
                  </div>
                </div>
                <div className="flex pt-8 justify-center">
                  <Button type="submit" disabled={loading}>
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
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAudio;
