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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import GetUserAudiosData from "@/routes/getUserAudiosData";
import deleteAudioPart from "@/routes/deleteAudioPart";

const AudioPartDeleteAlert = ({
  audioId,
  partName,
  category,
  audioURL,
}: {
  audioId: string;
  partName: string;
  category: string;
  audioURL: string;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshAudiosData } = GetUserAudiosData(category);
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger onClick={handleClick}>
        <Tooltip>
          <TooltipTrigger>
            <Trash2 className="w-4 h-4 hover:text-pink-600" />
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete this Audio Part</p>
          </TooltipContent>
        </Tooltip>
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
          <AlertDialogCancel onClick={handleClick}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              e.stopPropagation();
              await deleteAudioPart(audioId, router, toast, partName, audioURL);
              refreshAudiosData();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AudioPartDeleteAlert;
