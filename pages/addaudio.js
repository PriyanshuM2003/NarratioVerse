"use client";
import React, { useState } from "react";
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

const AddAudio = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Podcast");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [fields, setFields] = useState([
    {
      id: 1,
      partName: "",
      file: null,
    },
  ]);

  const [audioData, setAudioData] = useState({
    title: "",
    slug: "",
    coverImage: "",
    category: "",
    genres: [],
    keywords: [],
    parts: [],
  });

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleGenreSelect = (event) => {
    const selectedGenre = event.target.value;

    if (!selectedGenres.includes(selectedGenre)) {
      setSelectedGenres((prevGenres) => [...prevGenres, selectedGenre]);
      setSelectedGenre("");
    }
  };

  const handleGenreRemove = (genreToRemove) => {
    setSelectedGenres((prevGenres) =>
      prevGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  const handleAudioPartName = (event, fieldId) => {
    const updatedFields = fields.map((field) =>
      field.id === fieldId ? { ...field, partName: event.target.value } : field
    );
    setFields(updatedFields);
  };

  const handleAddAudioDataPart = (e) => {
    e.preventDefault();
    const nextId = fields.length + 1;
    setFields((prevFields) => [
      ...prevFields,
      {
        id: nextId,
        partName: "",
      },
    ]);
  };

  const handleRemoveAudioPart = (fieldId) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
  };

  const handleKeywordChange = (event) => {
    setCurrentKeyword(event.target.value);
  };

  const handleAddKeyword = (event) => {
    event.preventDefault();
    if (
      currentKeyword.trim() !== "" &&
      !keywords.includes(currentKeyword.trim().toLowerCase())
    ) {
      setKeywords((prevKeywords) => [
        ...prevKeywords,
        currentKeyword.trim().toLowerCase(),
      ]);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords((prevKeywords) =>
      prevKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  const clearFileInput = (selector) => {
    const fileInputs = document.querySelectorAll(selector);
    if (fileInputs) {
      fileInputs.forEach((input) => {
        input.value = "";
      });
    }
  };

  const handleAddAudioData = async (e) => {
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
        keywords,
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
          keywords: [],
          podcastParts: [],
        });
        setSelectedGenres([]);
        setKeywords([]);
        setFields([
          {
            id: 1,
            partName: "",
            file: null,
          },
        ]);
        clearFileInput('input[type="file"]');
      } else {
        console.error("Error adding audio data:", response.statusText);
        toast({
          variant: "destructive",
          description: `Error adding ${category}`,
        });
      }
    } catch (error) {
      console.error(`Error adding ${category}:`, error.message);
      toast({
        variant: "destructive",
        description: `Error adding ${category}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlecoverImage = async (e) => {
    const file = e.target.files[0];

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

  const handleAudioParts = async (e, fieldId) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);

        const oldAudioFileName = fields.find((field) => field.id === fieldId)
          .file?.name;

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
      <div className="p-8 text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Add {String(category)}
          </h2>
        </div>
        <Separator className="my-4" />
        <div className="mb-5 flex justify-center">
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
              <div className="flex flex-wrap -mx-3 mb-6 text-black">
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
                <div className="w-full text-black px-3 mb-6">
                  <Label>Genres</Label>
                  <div className="flex items-center space-x-1">
                    <select
                      className="w-[180px] border p-2 rounded-lg"
                      value={selectedGenre}
                      onChange={(event) => handleGenreSelect(event)}
                    >
                      <option value="" disabled>
                        Select Genre
                      </option>
                      {genres.map((genre) => (
                        <option key={genre.id} value={genre.id}>
                          {genre.label}
                        </option>
                      ))}
                    </select>
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
              <div className="flex flex-wrap space-x-1">
                <div className="w-full text-black mb-6">
                  <Label htmlFor="kword">Key Words for Search</Label>
                  <div className="flex items-center space-x-1">
                    <Input
                      type="text"
                      name="kword"
                      className="w-[400px]"
                      placeholder="Enter Key word for search and Press ENTER to add it"
                      id="kword"
                      value={currentKeyword}
                      onChange={handleKeywordChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleAddKeyword(e);
                      }}
                    />
                    <div className="flex flex-wrap space-x-1 space-y-1">
                      {keywords.map((keyword) => (
                        <Badge
                          key={keyword}
                          className="px-4 text-sm cursor-pointer"
                        >
                          {keyword}&nbsp;
                          <span
                            className="text-lg"
                            onClick={() => handleRemoveKeyword(keyword)}
                          >
                            &times;
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center text-black mb-2">
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
