"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Radio } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import GetLiveTalkData from "@/routes/getLiveTalkData";

const JoinLiveRoom = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [roomId, setRoomId] = useState("");
  const { liveTalkData, loadingLiveTalkData } = GetLiveTalkData();

  const joinRoom = () => {
    router.push(`live/${roomId}`);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="w-full">
          <div className="flex items-center w-full gap-1 hover:text-pink-600">
            <Radio className="w-5 h-5" />
            Join Live
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Live Session</DialogTitle>
            <DialogDescription>
              Paste/Enter the Room/Invitation Id to join the specific room
            </DialogDescription>
          </DialogHeader>
          {loadingLiveTalkData ? (
            <Loader className="animate-spin flex mx-auto" />
          ) : (
            <Input
              className="text-black"
              placeholder="Enter Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e?.target?.value)}
            />
          )}
          <div className="w-full flex justify-center">
            <Button
              disabled={loadingLiveTalkData}
              variant="secondary"
              onClick={joinRoom}
              className="w-1/4"
            >
              Join Room
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JoinLiveRoom;
