import { getAccessToken } from "@/lib/auth";

export async function removeFromPlaylist(
  audioId: string,
  name: string,
  router: any,
  toast: any
) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/removefromplaylist`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ audioId, name }),
    });
    toast({
      description: "Removed from playlist successfully",
    });
    return true;
  } catch (error) {
    console.error("Error removing from playlist:", error);
    toast({
      variant: "destructive",
      description: "Failed to remove from playlist",
    });
    return false;
  }
}
