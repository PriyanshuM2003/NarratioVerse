"use client";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";

const Accept = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [liveTalkInfo, setLiveTalkInfo] = useState({
    slug: "",
    title: "",
    hostname: "",
    uniqueToken: "",
  });

  useEffect(() => {
    const { invitation } = router.query;
    if (invitation) {
      handleAccept(invitation);
    }
  }, [router.query]);

  const handleAccept = async (uniqueToken) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token not found in localStorage");
        router.push("/login");
        return;
      }
      const response = await fetch("/api/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ uniqueToken }),
      });
      if (response.ok) {
        const { slug, title, hostname, uniqueToken } = await response.json();
        setLiveTalkInfo({ slug, title, hostname, uniqueToken });
        setLoading(false);
        router.push(`/live/${slug}`);
      } else if (response.status === 401) {
        console.error("Unauthorized: User not authenticated");
      } else {
        console.error("Failed to accept invitation:", response.statusText);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error accepting invitation:", error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-[350px]">
        <div>
          <h2>Join Live Podcast as Guest : {liveTalkInfo.title}</h2>
          <p>Hosted by: {liveTalkInfo.hostname}</p>
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="flex justify-between">
            <Button onClick={handleAccept}>Accept</Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Accept;
