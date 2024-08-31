import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import addAudioPart from "@/routes/addAudioPart";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import GetUserAudiosData from "@/routes/getUserAudiosData";
import { Loader } from "lucide-react";

interface AddAudioPartDialogProps {
  setAddAudioPartDialogOpen: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  addAudioPartDialogOpen: boolean;
  title: string;
  audioId: string;
  category: string;
}

const AddAudioPartDialog = ({
  addAudioPartDialogOpen,
  setAddAudioPartDialogOpen,
  title,
  audioId,
  category,
}: AddAudioPartDialogProps) => {
  const router = useRouter();
  const { toast } = useToast();
  const { refreshAudiosData } = GetUserAudiosData(category);
  const [partName, setPartName] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleAddPart = async () => {
    if (audioFile && partName) {
      setLoading(true);
      const success = await addAudioPart(
        audioId,
        router,
        toast,
        partName,
        audioFile,
        category
      );
      if (success) {
        setLoading(false);
        setAddAudioPartDialogOpen(null);
        refreshAudiosData();
      }
    } else {
      setLoading(false);
      toast({
        variant: "destructive",
        description: "Please provide both part name and audio file.",
      });
    }
  };
  return (
    <>
      <Dialog
        open={addAudioPartDialogOpen}
        onOpenChange={(val) => setAddAudioPartDialogOpen(val ? audioId : null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Audio Part in {title}</DialogTitle>
          </DialogHeader>
          <Label htmlFor="addAudioPartName">Part Name</Label>
          <Input
            required
            id="addAudioPartName"
            value={partName}
            onChange={(e) => setPartName(e.target.value)}
          />
          <Label htmlFor="addAudioPartUrl">Audio File</Label>
          <Input
            required
            type="file"
            accept="audio/*"
            onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
            id="addAudioPartUrl"
          />
          <DialogFooter>
            <Button
              disabled={loading}
              onClick={handleAddPart}
              variant={"destructive"}
              type="submit"
            >
              {loading ? <Loader className="animate-spin" /> : <>Add</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddAudioPartDialog;
