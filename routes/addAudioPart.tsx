import { getAccessToken } from "@/lib/auth";
import supabase from "@/lib/supabase";

export default async function addAudioPart(
  audioId: string,
  router: any,
  toast: any,
  partName: string,
  audioFile: File,
  category: string
) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }
    const uniqueId = Math.random().toString(36).substring(7);
    const filePath = `${category}/${uniqueId}_${audioFile.name}`;
    const { data: audioData, error: audioError } = await supabase.storage
      .from("AudioFiles")
      .upload(filePath, audioFile);

    if (audioError) {
      toast({
        variant: "destructive",
        description: `Error uploading audio file: ${audioError.message}`,
      });
      return false;
    }

    const { data: publicUrlData } = await supabase.storage
      .from("AudioFiles")
      .getPublicUrl(filePath);

    if (!publicUrlData) {
      toast({
        variant: "destructive",
        description: "Error retrieving public URL for the uploaded file",
      });
      return false;
    }

    const audioUrl = publicUrlData.publicUrl;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/addaudiopart`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ audioId, partName, audioUrl }),
      }
    );

    if (response.ok) {
      toast({
        description: "Audio part added successfully",
      });
      return true;
    } else {
      const errorData = await response.json();
      toast({
        variant: "destructive",
        description: errorData.error || "Failed to add audio part",
      });
      return false;
    }
  } catch (error) {
    console.error("Error adding audio part:", error);
    toast({
      variant: "destructive",
      description: "Failed to add audio part",
    });
    return false;
  }
}
