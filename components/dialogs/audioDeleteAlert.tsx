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
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import GetUserAudioData from "@/routes/getUserAudioData";
import { deleteAudio } from "@/routes/deleteAudio";
interface AudioDeleteAlertProps {
  setAudioDeleteAlertOpen: React.Dispatch<React.SetStateAction<string | null>>;
  audioDeleteAlertOpen: boolean;
  audioId: string;
}
const AudioDeleteAlert = ({
  audioId,
  setAudioDeleteAlertOpen,
  audioDeleteAlertOpen,
}: AudioDeleteAlertProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshAudioData } = GetUserAudioData();
  return (
    <AlertDialog
      open={audioDeleteAlertOpen}
      onOpenChange={(val) => setAudioDeleteAlertOpen(val ? audioId : null)}
    >
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
              setAudioDeleteAlertOpen(null);
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
