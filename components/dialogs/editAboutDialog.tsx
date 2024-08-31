import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import editAbout from "@/routes/editAbout";
import { useRouter } from "next/router";
import { useToast } from "../ui/use-toast";
import GetUserAudiosData from "@/routes/getUserAudiosData";
import { Loader } from "lucide-react";

interface AddAudioPartDialogProps {
  setEditAboutDialogOpen: React.Dispatch<React.SetStateAction<string | null>>;
  editAboutDialogOpen: boolean;
  audioId: string;
  title: string;
  about: string;
  category: string;
}

const EditAboutDialog = ({
  editAboutDialogOpen,
  setEditAboutDialogOpen,
  audioId,
  title,
  about,
  category,
}: AddAudioPartDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const [newAbout, setNewAbout] = useState(about);
  const { refreshAudiosData } = GetUserAudiosData(category);
  const [loading, setLoading] = useState(false);
  const handleUpdate = async () => {
    setLoading(true);
    const success = await editAbout(audioId, newAbout, router, toast);
    if (success) {
      setLoading(false);
      setEditAboutDialogOpen(null);
      refreshAudiosData();
    }
  };
  return (
    <>
      <Dialog
        open={editAboutDialogOpen}
        onOpenChange={(val) => setEditAboutDialogOpen(val ? "" : null)}
      >
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="text-white text-base">
              <Textarea
                className="min-h-56"
                value={newAbout}
                onChange={(e) => setNewAbout(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-between w-full">
            <Button
              disabled={loading}
              variant={"secondary"}
              onClick={() => setNewAbout("")}
            >
              Clear All
            </Button>
            <Button
              disabled={loading}
              variant={"destructive"}
              onClick={handleUpdate}
            >
              {loading ? <Loader className="animate-spin" /> : <>Update</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAboutDialog;
