import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface aboutDialogProps {
  setAboutDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  aboutDialogOpen: boolean;
  audioAbout: string;
  audioTitle: string;
}

const AboutDialog = ({
  aboutDialogOpen,
  setAboutDialogOpen,
  audioAbout,
  audioTitle,
}: aboutDialogProps) => {
  return (
    <>
      <Dialog
        open={aboutDialogOpen}
        onOpenChange={(val) => setAboutDialogOpen(val)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>About {audioTitle}</DialogTitle>
            <DialogDescription className="text-base text-white">
              {audioAbout}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AboutDialog;
