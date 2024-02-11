"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader, PlusCircle, Radio, X } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/data/preferences";

const GoLive = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [record, setRecord] = useState("No");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [fields, setFields] = useState([
    {
      id: 1,
      guestEmail: "",
    },
  ]);

  const handleTitle = (event) => {
    setTitle(event.target.value);
  };

  const handleRecordChange = (value) => {
    setRecord(value === "Yes" ? true : false);
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

  const handleGuestEmailPart = (event, fieldId) => {
    const updatedFields = fields.map((field) =>
      field.id === fieldId
        ? { ...field, guestEmail: event.target.value }
        : field
    );
    setFields(updatedFields);
  };

  const handleRemoveGuestEmailPart = (fieldId) => {
    setFields((prevFields) =>
      prevFields.filter((field) => field.id !== fieldId)
    );
  };

  const handleAddField = (e) => {
    e.preventDefault();
    const newField = {
      id: fields.length + 1,
      guestEmail: "",
    };
    setFields((prevFields) => [...prevFields, newField]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      const uniqueId = Math.random().toString(36).substring(7);
      const slug = `${uniqueId}_${title}`.split(" ").join("+");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/golive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title,
            record,
            slug,
            genres: selectedGenres,
            participants: fields.map((field) => ({
              email: field.guestEmail,
            })),
          }),
        }
      );

      if (response.ok) {
        const { liveTalk, hostUserName } = await response.json();

        for (const field of fields) {
          try {
            const emailResult = await fetch(
              `${process.env.NEXT_PUBLIC_HOST}/api/mailer`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  recipient: field.guestEmail,
                  subject: "Invitation to Live Talk",
                  htmlContent: `
                    <title>Invitation to Live Podcast</title>
                  <body style="  font-family: Arial, sans-serif;
                  background-color: #f5f5f5;
                  padding: 20px;">
                      <div style=" max-width: 600px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #fff;
                      border-radius: 8px;
                      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                          <div style="  text-align: center;
                          margin-bottom: 20px;">
                              <h1 style=" font-size: 24px;
                              font-weight: bold;
                              color: #333;
                              margin-bottom: 10px;">Invitation to Live Podcast</h1>
                          </div>
                          <div style=" font-size: 16px;
                          color: #666;">
                              <p>Hello,</p>
                              <p>You are invited to join our live podcast hosted by ${hostUserName}.</p>
                              <p>The podcast titled "${title}" will be starting soon. We would love to have you as a guest!</p>
                              <p>Join us by clicking the button below:</p>
                              <a style=" display: inline-block;
                              padding: 10px 20px;
                              background-color: #007bff;
                              color: #fff;
                              text-decoration: none;
                              border-radius: 4px;
                              cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease,
          border-color 0.3s ease;
      "
      onmouseover="this.style.backgroundColor='#333333'; this.style.color='#fff'; this.style.borderColor='#000000'"
      onmouseout="this.style.backgroundColor='#000000'; this.style.color='#fff'; this.style.borderColor='#333333'" href="${process.env.NEXT_PUBLIC_HOST}/accept?invitation=${slug}" class="button">Join Podcast</a>
                          </div>
                      </div>
                  </body>
                  `,
                }),
              }
            );

            if (emailResult.ok) {
              toast({
                description: `Email sent to ${field.guestEmail} successfully!`,
              });
              console.log(`Email sent to ${field.guestEmail} successfully!`);
            } else {
              toast({
                variant: "destructive",
                description: `Failed to send email to ${field.guestEmail}!`,
              });
              console.error(`Failed to send email to ${field.guestEmail}`);
            }
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }

        router.push(`/live/${liveTalk.slug}`);
      } else {
        console.error("Error creating LiveTalk:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating LiveTalk:", error);
    }

    setLoading(false);
  };

  return (
    <>
      <div className="p-8 min-h-screen text-white">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Go Live</h2>
        </div>
        <Separator className="my-4" />
        <div className="mb-5 flex justify-center">
          <div className="w-full px-4">
            <form>
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
                <div className="w-full md:w-1/2 flex items-center space-x-4">
                  <Label htmlFor="category">
                    Do you want to record this podcast audio?
                  </Label>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="radio"
                      id="yes"
                      name="record"
                      value="Yes"
                      checked={record === "Yes"}
                      onChange={() => handleRecordChange("Yes")}
                      className="h-5 w-5"
                    />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Input
                      type="radio"
                      id="no"
                      name="record"
                      value="No"
                      checked={record === "No"}
                      onChange={() => handleRecordChange("No")}
                      className="h-5 w-5"
                    />
                    <Label htmlFor="no">No</Label>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap -mx-3 mb-2">
                <div className="w-full text-black px-3 mb-6">
                  <Label>Genres</Label>
                  <div className="flex items-center space-x-1">
                    <select
                      className="w-[180px] border font-semibold p-2 rounded-lg"
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
              <div className="flex flex-wrap items-center text-black mb-2">
                {fields.map((field, index) => (
                  <div
                    className="w-full md:w-1/3 flex items-center mb-6"
                    key={field.id}
                  >
                    <div className="w-full mr-1">
                      <Label htmlFor={`guestEmail-${field.id}`}>{`Enter Guest ${
                        index + 1
                      } Email to Invite`}</Label>
                      <Input
                        name={`guestEmail-${field.id}`}
                        id={`guestEmail-${field.id}`}
                        value={field.guestEmail}
                        onChange={(event) =>
                          handleGuestEmailPart(event, field.id)
                        }
                        type="text"
                      />
                    </div>
                    {field.id !== fields[0].id && (
                      <Button
                        className="mt-6 mr-1"
                        onClick={() => handleRemoveGuestEmailPart(field.id)}
                      >
                        <X color="#ffffff" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button className="ml-1" onClick={handleAddField}>
                  <PlusCircle color="#ffffff" />
                  &nbsp;Add Field
                </Button>
              </div>
              <div className="flex mx-auto items-center justify-center mt-4">
                <Button onClick={handleSubmit}>
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    <>
                      <Radio className="w-4 h-4" />
                      &nbsp;Go Live
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

export default GoLive;
