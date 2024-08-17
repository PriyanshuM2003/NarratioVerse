import { getAccessToken } from "@/lib/auth";

export async function updateStreamCount(
  audioId: string,
  router: any,
  toast: any
) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }

    await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/updatestreamcount`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ audioId }),
    });
    return true;
  } catch (error) {
    console.error("Error updating stream count:", error);
    toast({
      variant: "destructive",
      description: "Failed to update stream count",
    });
    return false;
  }
}
