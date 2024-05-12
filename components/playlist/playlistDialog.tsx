"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { createPlaylist } from "@/routes/createPlaylist";
import GetPlaylistsData from "@/routes/getPlaylistsData";

interface playlistDialogProps {
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogOpen: boolean;
  audioId: string;
}

const PlaylistDialog = ({
  dialogOpen,
  setDialogOpen,
  audioId,
}: playlistDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { refreshPlaylists } = GetPlaylistsData();

  const handleCreatePlaylist = async () => {
    setLoading(true);
    await createPlaylist(audioId, name, router, toast);
    refreshPlaylists();
    setLoading(false);
    setDialogOpen(false);
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={(val) => setDialogOpen(val)}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Playlist</DialogTitle>
          </DialogHeader>
          <Input
            className="text-black"
            disabled={loading}
            placeholder="Enter Playlist Name"
            value={name}
            onChange={(e) => setName(e?.target?.value)}
          />
          <div className="w-full flex justify-center">
            <Button
              variant="secondary"
              disabled={loading}
              className="w-1/4"
              onClick={handleCreatePlaylist}
            >
              {loading ? <Loader className="animate-spin" /> : <>Create</>}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistDialog;
