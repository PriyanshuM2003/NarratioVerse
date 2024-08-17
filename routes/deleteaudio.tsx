import { getAccessToken } from "@/lib/auth";

export async function deleteAudio(audioId: string, router: any, toast: any) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteaudio`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ audioId }),
    });
    toast({
      description: "Audio deleted successfully",
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
