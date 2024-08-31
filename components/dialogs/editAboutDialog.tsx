import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAudioPartDialogProps {
  setEditAboutDialogOpen: React.Dispatch<React.SetStateAction<string | null>>;
  editAboutDialogOpen: boolean;
}

const EditAboutDialog = ({
  editAboutDialogOpen,
  setEditAboutDialogOpen,
}: AddAudioPartDialogProps) => {
  return (
    <>
      <Dialog
        open={editAboutDialogOpen}
        onOpenChange={(val) => setEditAboutDialogOpen(val ? "" : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditAboutDialog;
