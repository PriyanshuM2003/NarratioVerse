"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { PlusCircle, X } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/data/preferences";

const Add = () => {
  const [selectedTab, setSelectedTab] = useState("podcast");
  const [episodeName, setEpisodeName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [episodeFields, setEpisodeFields] = useState([
    {
      id: 1,
      partName: "",
    },
  ]);

  const handleTabChange = (value) => {
    setSelectedTab(value);
  };

  const handleEpisodeNameChange = (event) => {
    setEpisodeName(event.target.value);
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

  const handleEpisodePartNameChange = (event, fieldId) => {
    const updatedFields = episodeFields.map((field) =>
      field.id === fieldId ? { ...field, partName: event.target.value } : field
    );
    setEpisodeFields(updatedFields);
  };

  const handleAddEpisodeField = (e) => {
    e.preventDefault();
    const nextId = episodeFields.length + 1;
    setEpisodeFields((prevFields) => [
      ...prevFields,
      {
        id: nextId,
        partName: "",
      },
    ]);
  };

  const handleRemoveEpisodeField = (fieldId) => {
    setEpisodeFields((prevFields) =>
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

  return (
    <>
      <div className="p-8 text-white">
        <Tabs defaultValue="podcast">
          <div className="mb-5 flex justify-center">
            <TabsList className="bg-gray-950 border-2 text-white">
              <TabsTrigger
                value="podcast"
                onClick={() => handleTabChange("podcast")}
                className={`relative ${
                  selectedTab === "podcast" ? "active" : ""
                }`}
              >
                Podcast
              </TabsTrigger>
              <TabsTrigger
                value="audiobook"
                onClick={() => handleTabChange("audiobook")}
                className={`relative ${
                  selectedTab === "audiobook" ? "active" : ""
                }`}
              >
                Audio Book
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="w-full px-4">
            <form>
              <div className="flex flex-wrap -mx-3 mb-6">
                <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                  <Label htmlFor="eName">Episode Name</Label>
                  <Input
                    name="eName"
                    id="eName"
                    value={episodeName}
                    onChange={handleEpisodeNameChange}
                    type="text"
                  />
                </div>
                <div className="w-full md:w-1/2 px-3">
                  <Label htmlFor="">Upload Cover Image</Label>
                  <Input
                    className="text-black cursor-pointer bg-gray-50"
                    id=""
                    type="file"
                  />
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full text-black px-3 mb-6">
                  <Label>Genre</Label>
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
              <Button onClick={handleAddEpisodeField}>
                <PlusCircle color="#ffffff" />
              </Button>
              <div className="flex flex-wrap items-center -mx-3 mb-2">
                {episodeFields.map((field, index) => (
                  <div
                    className="w-full space-x-2 md:w-1/2 flex items-center px-3 mb-6"
                    key={field.id}
                  >
                    <div className="w-full">
                      <Label htmlFor={`epName-${field.id}`}>{`Episode Part ${
                        index + 1
                      } Name`}</Label>
                      <Input
                        name={`epName-${field.id}`}
                        id={`epName-${field.id}`}
                        value={field.partName}
                        onChange={(event) =>
                          handleEpisodePartNameChange(event, field.id)
                        }
                        type="text"
                      />
                    </div>
                    <div className="w-full">
                      <Label htmlFor={`file-${field.id}`}>{`Upload EP ${
                        index + 1
                      } Audio`}</Label>
                      <div className="flex items-center space-x-1">
                        <Input
                          className="text-black cursor-pointer bg-gray-50"
                          id={`file-${field.id}`}
                          type="file"
                        />
                        {field.id !== episodeFields[0].id && (
                          <Button
                            onClick={() => handleRemoveEpisodeField(field.id)}
                          >
                            <X color="#ffffff" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <TabsContent value="podcast">
                <div className="flex mx-auto items-center justify-center mt-4">
                  <Button>
                    <PlusCircle className="w-4 h-4" />
                    &nbsp;Podcast
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="audiobook">
                <div className="flex mx-auto items-center justify-center mt-4">
                  <Button>
                    <PlusCircle className="w-4 h-4" />
                    &nbsp;Audio Book
                  </Button>
                </div>
              </TabsContent>
            </form>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Add;
