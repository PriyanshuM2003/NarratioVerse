import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { User } from "@/types/types";
import { getAccessToken } from "@/lib/auth";
import useSWR from "swr";

export default function useLoggedUserData(): {
  loggedUserData: User | null;
  loadingUserData: boolean;
  refreshLoggedUserData: () => void;
} {
  const router = useRouter();
  const { toast } = useToast();

  const fetcher = async (url: string) => {
    const token = getAccessToken();
    if (!token) {
      return null;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to fetch user data");
    }

    const data = await response.json();
    return data.user as User;
  };

  const {
    data,
    error,
    isValidating,
    mutate: swrMutate,
  } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_HOST}/api/getuser`,
    fetcher
  );

  const loggedUserData = data ?? null;
  const loadingUserData = !loggedUserData && !error;

  const refreshLoggedUserData = () => {
    swrMutate();
  };

  useEffect(() => {
    if (error) {
      console.error("Token verification failed:", error);
      if (error.message === "Unauthorized") {
        null;
      } else {
        toast({
          title: "Error",
          description: "Failed to load user data.",
          variant: "destructive",
        });
      }
    }
  }, [error, router, toast]);

  return { loggedUserData, loadingUserData, refreshLoggedUserData };
}
