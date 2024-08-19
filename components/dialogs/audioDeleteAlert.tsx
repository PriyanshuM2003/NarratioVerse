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
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { deleteAudio } from "@/routes/deleteaudio";
import GetUserAudioData from "@/routes/getUserAudioData";

const AudioDeleteAlert = ({ audioId }: { audioId: string }) => {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshAudioData } = GetUserAudioData();
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
            audio file and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteAudio(audioId, router, toast);
              refreshAudioData();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AudioDeleteAlert;
