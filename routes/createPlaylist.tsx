export async function createPlaylist(
  audioId: string,
  name: string,
  router: any,
  toast: any
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return false;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/createplaylist`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ audioId, name }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      if (data.error) {
        toast({
          variant: "destructive",
          description: data.error,
        });
        return false;
      } else if (data.created) {
        toast({
          description: "Playlist created successfully",
        });
      } else {
        toast({
          description: "Audio Added to playlist successfully",
        });
      }
      return true;
    } else {
      toast({
        variant: "destructive",
        description: data.error || "Failed to perform action",
      });
      return false;
    }
  } catch (error) {
    console.error("Error adding playlist:", error);
    toast({
      variant: "destructive",
      description: "Failed to perform action",
      error,
    });
    return false;
  }
}
