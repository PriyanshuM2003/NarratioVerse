"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/data/preferences";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

const AddPodcast = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [podcastName, setPodcastName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [podcastFields, setEPodcastFields] = useState([
    {
      id: 1,
      partName: "",
    },
  ]);

  const [podcastData, setPodcastData] = useState({
    podcastName: "",
    podcastImage: "",
    genres: [],
    keywords: [],
    podcastParts: [],
    podcastAudioParts: [],
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
    setEPodcastFields(updatedFields);
  };

  const handleAddPocastPart = (e) => {
    e.preventDefault();
    const nextId = podcastFields.length + 1;
    setEPodcastFields((prevFields) => [
      ...prevFields,
      {
        id: nextId,
        partName: "",
      },
    ]);
  };

  const handleRemovePocastPart = (fieldId) => {
    setEPodcastFields((prevFields) =>
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
      !keywords.includes(currentKeyword.trim())
    ) {
      setKeywords((prevKeywords) => [...prevKeywords, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove) => {
    setKeywords((prevKeywords) =>
      prevKeywords.filter((keyword) => keyword !== keywordToRemove)
    );
  };

  const handlePodcastImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);
        const oldImageFileName = podcastData.profileImage.split("/").pop();
        if (oldImageFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("Images")
              .remove([`Podcast/${oldImageFileName}`]);

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
            description: "Error uploading profile image",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("Images")
            .getPublicUrl(`Podcast/${uniqueId}_${file.name}`);
          setPodcastData({
            ...podcastData,
            coverImage: downloadUrl.data.publicUrl,
          });
          toast({
            description: "Profile image uploaded successfully",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          description: "Error uploading profile image",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap -mx-3 mb-6">
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
            name="coverImage"
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
      <Button onClick={handleAddPocastPart}>
        <PlusCircle color="#ffffff" />
      </Button>
      <div className="flex flex-wrap items-center -mx-3 mb-2">
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
        <Button>
          <PlusCircle className="w-4 h-4" />
          &nbsp;Podcast
        </Button>
      </div>
    </>
  );
};

export default AddPodcast;
