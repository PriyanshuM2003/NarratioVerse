import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "@/types/types";
import { getAccessToken } from "@/lib/auth";

export default function GetLoggedUserData(): {
  loggedUserData: User | null;
  loadingUserData: boolean;
} {
  const router = useRouter();
  const { toast } = useToast();
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);
  const [loggedUserData, setloggedUserData] = useState<User | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      fetchLoggedUserData().finally(() => setLoadingUserData(false));
    }
  }, []);

  const fetchLoggedUserData = async () => {
    try {
      const token = getAccessToken();
      if (!token) {
        router.push("/login");
        return;
      }

      setLoadingUserData(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unauthorized");
      }

      const data = await response.json();
      setloggedUserData(data.user);
    } catch (error) {
      console.error("Token verification failed:", error);
      router.push("/");
    }
  };
  return { loggedUserData, loadingUserData };
}
