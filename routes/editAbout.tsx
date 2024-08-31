import { getAccessToken } from "@/lib/auth";

export default async function editAbout(
  audioId: string,
  router: any,
  toast: any,
  about: string
) {
  try {
    const token = getAccessToken();
    if (!token) {
      router.push("/");
      return;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/editabout`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ audioId, about }),
      }
    );
    if (response.ok) {
      toast({
        description: "About updated successfully",
      });
      return true;
    } else {
      toast({
        variant: "destructive",
        description: "Failed to update about",
      });
      return false;
    }
  } catch (error) {
    console.error("Error updating about:", error);
    toast({
      variant: "destructive",
      description: "Failed to update about",
    });
    return false;
  }
}
