import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deletePlaylist } from "@/routes/deletePlaylist";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import GetPlaylistsData from "@/routes/getPlaylistsData";

const PlaylistDeleteAlert = ({ playlistId }: { playlistId: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshPlaylists } = GetPlaylistsData();
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Trash2 className="w-5 h-5 hover:text-pink-600" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deletePlaylist(playlistId, router, toast);
              refreshPlaylists();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PlaylistDeleteAlert;
