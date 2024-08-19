"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader, PlusCircle, Radio, X } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { genres } from "@/data/preferences";
import { v4 as uuidv4 } from "uuid";
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
import { getAccessToken } from "@/lib/auth";
import { Label } from "@/components/ui/label";

interface GoLiveFormInputs {
  title: string;
  record: "Yes" | "No";
  genres: string[];
  participants: { guestEmail: string }[];
}
const GoLive: React.FC = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    record: z.enum(["Yes", "No"]),
    genres: z.array(z.string()).min(1, "At least one genre is required"),
    participants: z.array(
      z.object({
        guestEmail: z
          .string()
          .email("Invalid email address")
          .nonempty("Email is required"),
      })
    ),
  });
  const formMethods = useForm<GoLiveFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      record: "No",
      genres: [],
      participants: [{ guestEmail: "" }],
    },
  });
  const { control, handleSubmit, setValue, watch, register, getValues } =
    formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });
  const record = watch("record");
  const [roomId, setRoomId] = useState<string>("");

  const joinRoom = () => {
    if (roomId) router.push(`live/${roomId}`);
    else {
      alert("Please provide a valid room id");
    }
  };
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

  const onSubmit: SubmitHandler<GoLiveFormInputs> = async (data) => {
    setLoading(true);

    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/");
        return;
      }
      const roomId = uuidv4();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/golive`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            record: data.record === "Yes",
            roomId,
          }),
        }
      );

      if (response.ok) {
        const { liveTalk, hostUserName } = await response.json();
        const participants = getValues().participants;
        for (const participant of participants) {
          try {
            console.log("Sending email to:", participant.guestEmail);
            const emailResult = await fetch(
              `${process.env.NEXT_PUBLIC_HOST}/api/mailer`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  recipient: participant.guestEmail,
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
                              <p>The podcast titled "${data.title}" will be starting soon. We would love to have you as a guest!</p>
                              <p>Join us by using the code below:</p>
                              <div style=" display: inline-block;
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
      onmouseout="this.style.backgroundColor='#000000'; this.style.color='#fff'; this.style.borderColor='#333333'">${roomId}</div>
                          </div>
                      </div>
                  </body>
                  `,
                }),
              }
            );

            if (emailResult.ok) {
              toast({
                description: `Email sent to ${participant.guestEmail} successfully!`,
              });
              router.push(`/live/${roomId}`);
              console.log(
                `Email sent to ${participant.guestEmail} successfully!`
              );
            } else {
              toast({
                variant: "destructive",
                description: `Failed to send email to ${participant.guestEmail}!`,
              });
              console.error(
                `Failed to send email to ${participant.guestEmail}`
              );
            }
          } catch (error) {
            console.error("Error sending email:", error);
          }
        }
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
      <div className="px-8 pb-4 min-h-screen text-white">
        <h2 className="text-2xl font-semibold tracking-tight">Go Live</h2>
        <Separator className="my-4" />
        <div className="mb-5 flex justify-center">
          <div className="w-full px-4">
            <div className="flex flex-col space-y-4 items-center mt-3 w-full">
              <h3 className="text-lg font-semibold">Join Room</h3>
              <Input
                className="text-black w-1/3"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e?.target?.value)}
              />
              <Button onClick={joinRoom}>Join Room</Button>
            </div>
            <Separator className="my-4" />
            <Form {...formMethods}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-2 items-center gap-4">
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
                  {/* <div className="flex items-center gap-4">
                    <Label htmlFor="record">
                      Do you want to record this podcast audio?
                    </Label>
                    <FormField
                      control={control}
                      name="record"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-1">
                          <FormLabel>Yes</FormLabel>
                          <FormControl>
                            <Input
                              type="radio"
                              value={"Yes"}
                              checked={record === "Yes"}
                              {...register("record")}
                              className="h-5 w-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="record"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-1">
                          <FormLabel>No</FormLabel>
                          <FormControl>
                            <Input
                              type="radio"
                              value={"No"}
                              checked={record === "No"}
                              {...register("record")}
                              className="h-5 w-5"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div> */}
                </div>
                <div className="flex flex-wrap -mx-3 mb-2 text-white">
                  <div className="w-full px-3 mb-6">
                    <FormField
                      control={control}
                      name="genres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Genres</FormLabel>
                          <div className="flex items-center space-x-1">
                            <DropdownMenu
                              open={open}
                              onOpenChange={(val) => setOpen(val)}
                            >
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-black"
                                >
                                  Select Genre
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="overflow-y-auto scrollbar-none h-56">
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
                                      onClick={() =>
                                        handleGenreRemove(selectedGenre)
                                      }
                                    >
                                      &times;
                                    </span>
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {fields.map((field, index) => (
                    <>
                      <FormField
                        key={field.id}
                        control={control}
                        name={`participants.${index}.guestEmail`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{`Enter Guest ${
                              index + 1
                            } Email to Invite`}</FormLabel>
                            <div className="flex items-center gap-2">
                              <FormControl>
                                <Input className="w-[22.5rem]" {...field} />
                              </FormControl>
                              {index !== 0 && (
                                <Button onClick={() => remove(index)}>
                                  <X color="#ffffff" />
                                </Button>
                              )}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ))}
                  <Button
                    className="mt-1"
                    onClick={() => append({ guestEmail: "" })}
                  >
                    <PlusCircle color="#ffffff" />
                    &nbsp;Add Field
                  </Button>
                </div>
                <div className="flex mx-auto items-center justify-center mt-4">
                  <Button type="submit">
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
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default GoLive;
