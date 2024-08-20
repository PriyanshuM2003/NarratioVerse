import { getAccessToken } from "@/lib/auth";

export default async function deleteAudioPart(
  audioId: string,
  router: any,
  toast: any,
  partName: string,
  audioURL: string
) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteaudiopart`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ audioId, partToDelete: { partName, audioURL } }),
    });
    toast({
      description: "Audio part deleted successfully",
    });
    return true;
  } catch (error) {
    console.error("Error deleting audio:", error);
    toast({
      variant: "destructive",
      description: "Failed to delete audio",
    });
    return false;
  }
}
