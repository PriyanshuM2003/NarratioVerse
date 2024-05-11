export async function removeFollowing(
  creatorId: string,
  router: any,
  toast: any
) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/removefollowing`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ creatorId }),
    });
    return true;
  } catch (error) {
    console.error("Error removing following:", error);
    toast({
      variant: "destructive",
      description: "Failed to remove following",
    });
    return false;
  }
}
