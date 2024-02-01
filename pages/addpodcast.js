"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader, PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/data/preferences";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import supabase from "@/lib/supabase";

const AddPodcast = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [podcastName, setPodcastName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [podcastFields, setPodcastFields] = useState([
    {
      id: 1,
      partName: "",
      file: null,
    },
  ]);

  const [podcastData, setPodcastData] = useState({
    podcastName: "",
    podcastImage: "",
    genres: [],
    keywords: [],
    podcastParts: [],
  });

  const handlePodcastName = (event) => {
    setPodcastName(event.target.value);
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

  const handlePodcastPartName = (event, fieldId) => {
    const updatedFields = podcastFields.map((field) =>
      field.id === fieldId ? { ...field, partName: event.target.value } : field
    );
    setPodcastFields(updatedFields);
  };

  const handleAddPodcastPart = (e) => {
    e.preventDefault();
    const nextId = podcastFields.length + 1;
    setPodcastFields((prevFields) => [
      ...prevFields,
      {
        id: nextId,
        partName: "",
      },
    ]);
  };

  const handleRemovePocastPart = (fieldId) => {
    setPodcastFields((prevFields) =>
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

  const handleAddPodcast = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      setLoading(true);
      const postData = {
        podcastName,
        podcastImage: podcastData.podcastImage,
        genres: selectedGenres,
        keywords,
        podcastParts: podcastFields.map((field) => ({
          partName: field.partName,
          audioUrl: field.audioUrl,
        })),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/addpodcast`,
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
        console.log("Podcast added successfully:", responseData);
        toast({
          description: "Podcast added successfully",
        });
        setPodcastName("");
        setPodcastData({
          podcastName: "",
          podcastImage: "",
          genres: [],
          keywords: [],
          podcastParts: [],
        });
        setSelectedGenres([]);
        setKeywords([]);
        setPodcastFields([
          {
            id: 1,
            partName: "",
            file: null,
          },
        ]);
      } else {
        console.error("Error adding podcast:", response.statusText);
        toast({
          variant: "destructive",
          description: "Error adding podcast",
        });
      }
    } catch (error) {
      console.error("Error adding podcast:", error.message);
      toast({
        variant: "destructive",
        description: "Error adding podcast",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePodcastImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);
        const oldPodcastImageFileName = podcastData.podcastImage
          .split("/")
          .pop();
        if (oldPodcastImageFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("Images")
              .remove([`Podcast/${oldPodcastImageFileName}`]);

          if (removeError) {
            console.error("Error removing old image:", removeError);
          } else {
            console.log("Old image removed successfully:", removeData);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(`Podcast/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading podcast image",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("Images")
            .getPublicUrl(`Podcast/${uniqueId}_${file.name}`);
          setPodcastData({
            ...podcastData,
            podcastImage: downloadUrl.data.publicUrl,
          });
          toast({
            description: "Podcast image uploaded successfully",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error uploading podcast image",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePodcastAudioParts = async (e, fieldId) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);

        const oldAudioFileName = podcastFields.find(
          (field) => field.id === fieldId
        ).file?.name;

        if (oldAudioFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("AudioFiles")
              .remove([`Podcast/${oldAudioFileName}`]);

          if (removeError) {
            console.error("Error removing old audio file:", removeError);
          } else {
            console.log("Old audio removed successfully:", removeData);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("AudioFiles")
          .upload(`Podcast/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading audio file",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("AudioFiles")
            .getPublicUrl(`Podcast/${uniqueId}_${file.name}`);

          const updatedFields = podcastFields.map((field) =>
            field.id === fieldId
              ? { ...field, file: file, audioUrl: downloadUrl.data.publicUrl }
              : field
          );

          setPodcastFields(updatedFields);

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
      <div className="flex flex-wrap -mx-3 mb-6 text-black">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <Label htmlFor="eName">Podcast Name</Label>
          <Input
            name="podcastName"
            id="podcastName"
            value={podcastName}
            onChange={handlePodcastName}
            type="text"
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <Label htmlFor="podcastImage">Upload Podcast Cover Image</Label>
          <Input
            className="text-black cursor-pointer bg-gray-50"
            id="podcastImage"
            name="podcastImage"
            type="file"
            onChange={handlePodcastImage}
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
                <Badge key={keyword} className="px-4 text-sm cursor-pointer">
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
      <Button onClick={handleAddPodcastPart}>
        <PlusCircle color="#ffffff" />
      </Button>
      <div className="flex flex-wrap items-center text-black -mx-3 mb-2">
        {podcastFields.map((field, index) => (
          <div
            className="w-full space-x-2 md:w-1/2 flex items-center px-3 mb-6"
            key={field.id}
          >
            <div className="w-full">
              <Label htmlFor={`ppName-${field.id}`}>{`Podcast Part ${
                index + 1
              } Name`}</Label>
              <Input
                name={`ppName-${field.id}`}
                id={`ppName-${field.id}`}
                value={field.partName}
                onChange={(event) => handlePodcastPartName(event, field.id)}
                type="text"
              />
            </div>
            <div className="w-full">
              <Label htmlFor={`file-${field.id}`}>{`Upload PP ${
                index + 1
              } Audio`}</Label>
              <div className="flex items-center space-x-1">
                <Input
                  className="text-black cursor-pointer bg-gray-50"
                  id={`file-${field.id}`}
                  type="file"
                  onChange={(e) => handlePodcastAudioParts(e, field.id)}
                />
                {field.id !== podcastFields[0].id && (
                  <Button onClick={() => handleRemovePocastPart(field.id)}>
                    <X color="#ffffff" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex mx-auto items-center justify-center mt-4">
        <Button onClick={handleAddPodcast}>
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              &nbsp;Podcast
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default AddPodcast;
