import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AddAudioPartDialogProps {
  setAddAudioPartDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addAudioPartDialogOpen: boolean;
}

const AddAudioPartDialog = ({
  addAudioPartDialogOpen,
  setAddAudioPartDialogOpen,
}: AddAudioPartDialogProps) => {
  return (
    <>
      <Dialog
        open={addAudioPartDialogOpen}
        onOpenChange={(val) => setAddAudioPartDialogOpen(val)}
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

export default AddAudioPartDialog;
