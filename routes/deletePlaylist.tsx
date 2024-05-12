export async function deletePlaylist(
  playlistId: string,
  router: any,
  toast: any
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/deleteplaylist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ playlistId }),
    });
    toast({
      description: "Playlist deleted successfully",
    });
    return true;
  } catch (error) {
    console.error("Error deleting playlist:", error);
    toast({
      variant: "destructive",
      description: "Failed to delete playlist",
    });
    return false;
  }
}
