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

const AddAudiobook = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [audiobookName, setAudiobookName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [audiobookFields, setAudiobookFields] = useState([
    {
      id: 1,
      partName: "",
      file: null,
    },
  ]);

  const [audiobookData, setAudiobookData] = useState({
    audiobookName: "",
    audiobookImage: "",
    genre: [],
    keyword: [],
    audiobookParts: [],
  });

  const handleAudiobookName = (event) => {
    setAudiobookName(event.target.value);
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

  const handleAudiobookPartName = (event, fieldId) => {
    const updatedFields = audiobookFields.map((field) =>
      field.id === fieldId ? { ...field, partName: event.target.value } : field
    );
    setAudiobookFields(updatedFields);
  };

  const handleAddAudiobookPart = (e) => {
    e.preventDefault();
    const nextId = audiobookFields.length + 1;
    setAudiobookFields((prevFields) => [
      ...prevFields,
      {
        id: nextId,
        partName: "",
      },
    ]);
  };

  const handleRemoveAudiobookPart = (fieldId) => {
    setAudiobookFields((prevFields) =>
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

  const handleAddAudiobook = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      setLoading(true);
      const postData = {
        audiobookName,
        audiobookImage: audiobookData.audiobookImage,
        genres: selectedGenres,
        keywords,
        audiobookParts: audiobookFields.map((field) => ({
          partName: field.partName,
          audioUrl: field.audioUrl,
        })),
      };
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/addaudiobook`,
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
        console.log("Audiobook added successfully:", responseData);
        toast({
          description: "Audiobook added successfully",
        });
        setAudiobookName("");
        setAudiobookData({
          audiobookName: "",
          audiobookImage: "",
          genres: [],
          keywords: [],
          audiobookParts: [],
        });
        setSelectedGenres([]);
        setKeywords([]);
        setAudiobookFields([
          {
            id: 1,
            partName: "",
            file: null,
          },
        ]);
      } else {
        console.error("Error adding audiobook:", response.statusText);
        toast({
          variant: "destructive",
          description: "Error adding audiobook",
        });
      }
    } catch (error) {
      console.error("Error adding audiobook:", error.message);
      toast({
        variant: "destructive",
        description: "Error adding audiobook",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAudiobookImage = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);
        const oldAudiobookImageFileName = audiobookData.audiobookImage
          .split("/")
          .pop();
        if (oldAudiobookImageFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("Images")
              .remove([`Audiobook/${oldAudiobookImageFileName}`]);

          if (removeError) {
            console.error("Error removing old image:", removeError);
          } else {
            console.log("Old image removed successfully:", removeData);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("Images")
          .upload(`Audiobook/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading profile image",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("Images")
            .getPublicUrl(`Audiobook/${uniqueId}_${file.name}`);
          setAudiobookData({
            ...audiobookData,
            audiobookImage: downloadUrl.data.publicUrl,
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

  const handleAudiobookAudioParts = async (e, fieldId) => {
    const file = e.target.files[0];

    if (file) {
      try {
        setLoading(true);

        const oldAudioFileName = audiobookFields.find(
          (field) => field.id === fieldId
        ).file?.name;

        if (oldAudioFileName) {
          const { data: removeData, error: removeError } =
            await supabase.storage
              .from("AudioFiles")
              .remove([`Audiobook/${oldAudioFileName}`]);

          if (removeError) {
            console.error("Error removing old audio file:", removeError);
          } else {
            console.log("Old audio removed successfully:", removeData);
          }
        }

        const uniqueId = Math.random().toString(36).substring(7);
        const { data, error } = await supabase.storage
          .from("AudioFiles")
          .upload(`Audiobook/${uniqueId}_${file.name}`, file);

        if (error) {
          toast({
            variant: "destructive",
            description: "Error uploading audio file",
          });
        } else {
          const downloadUrl = await supabase.storage
            .from("AudioFiles")
            .getPublicUrl(`Audiobook/${uniqueId}_${file.name}`);

          const updatedFields = audiobookFields.map((field) =>
            field.id === fieldId
              ? { ...field, file: file, audioUrl: downloadUrl.data.publicUrl }
              : field
          );

          setAudiobookFields(updatedFields);

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
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <Label htmlFor="eName">Audio Book Name</Label>
          <Input
            name="audiobookName"
            id="audiobookName"
            value={audiobookName}
            onChange={handleAudiobookName}
            type="text"
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <Label htmlFor="audiobookImage">Upload Audio Book cover Image</Label>
          <Input
            className="text-black cursor-pointer bg-gray-50"
            id="audiobookImage"
            name="audiobookImage"
            type="file"
            onChange={handleAudiobookImage}
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
      <Button onClick={handleAddAudiobookPart}>
        <PlusCircle color="#ffffff" />
      </Button>
      <div className="flex flex-wrap items-center -mx-3 mb-2">
        {audiobookFields.map((field, index) => (
          <div
            className="w-full space-x-2 md:w-1/2 flex items-center px-3 mb-6"
            key={field.id}
          >
            <div className="w-full">
              <Label htmlFor={`abpName-${field.id}`}>{`Audio Book Part ${
                index + 1
              } Name`}</Label>
              <Input
                name={`abpName-${field.id}`}
                id={`abpName-${field.id}`}
                value={field.partName}
                onChange={(event) => handleAudiobookPartName(event, field.id)}
                type="text"
              />
            </div>
            <div className="w-full">
              <Label htmlFor={`file-${field.id}`}>{`Upload ABP ${
                index + 1
              } Audio`}</Label>
              <div className="flex items-center space-x-1">
                <Input
                  className="text-black cursor-pointer bg-gray-50"
                  id={`file-${field.id}`}
                  type="file"
                  onChange={(e) => handleAudiobookAudioParts(e, field.id)}
                />
                {field.id !== audiobookFields[0].id && (
                  <Button onClick={() => handleRemoveAudiobookPart(field.id)}>
                    <X color="#ffffff" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex mx-auto items-center justify-center mt-4">
        <Button onClick={handleAddAudiobook}>
          {loading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              &nbsp;Audio Book
            </>
          )}
        </Button>
      </div>
    </>
  );
};

export default AddAudiobook;
