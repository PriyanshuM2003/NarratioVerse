import { getAccessToken } from "@/lib/auth";

export async function addFollow(creatorId: string, router: any, toast: any) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/addfollow`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ creatorId }),
      }
    );
    if (response.ok) {
      toast({
        description: "You are now following this creator.",
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        description: "Failed to add following",
      });
      return false;
    }
  } catch (error) {
    console.error("Error adding following:", error);
    toast({
      variant: "destructive",
      description: "Failed to add following",
    });
    return false;
  }
}
