import { CopyToClipboard } from "react-copy-to-clipboard";
import { Copy, UserRoundPlus } from "lucide-react";
import { toast } from "../ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "../ui/separator";

interface UserData {
  name: string;
  isHost: boolean;
}

interface CopySectionProps {
  roomId: string;
  user: UserData;
}

const CopySection = (props: CopySectionProps) => {
  const { roomId, user } = props;

  const handleCopy = () => {
    toast({
      description: `Copied Successfully!`,
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" size="sm">Room info</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Room ID</DialogTitle>
            <DialogDescription>
              Anyone who has this ID will be able to Join this Room.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="roomId" className="sr-only">
                Room ID
              </Label>
              <Input
                className="placeholder:text-black"
                id="roomId"
                placeholder={roomId}
                readOnly
              />
            </div>
            <CopyToClipboard text={roomId} onCopy={handleCopy}>
              <Button variant="secondary">
                <span className="sr-only">Copy</span>
                <Copy className="h-4 w-4" />
              </Button>
            </CopyToClipboard>
          </div>
          {user?.isHost && (
            <>
              <Separator className="mt-2" />
              <div className="space-y-2">
                <span className="font-semibold">Invite Participants</span>
                <div className="flex items-center gap-2">
                  <Input placeholder="Enter Participant Email" />
                  <Button variant="secondary">
                    <UserRoundPlus className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button variant="destructive">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CopySection;
