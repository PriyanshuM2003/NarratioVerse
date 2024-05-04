"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { Skeleton } from "@/components/ui/skeleton";

const LiveHistory = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(true);
  const [liveHistory, setLiveHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchLiveHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/");
          return;
        }
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_HOST}/api/getlivehistory`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch live history");
        }

        const data = await response.json();
        setLiveHistory(data.userLiveHistory);
      } catch (error) {
        console.error("Error fetching live history:", error);
        toast({
          variant: "destructive",
          description: "Failed to fetch Live History",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLiveHistory();
  }, [toast, router]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateTimeDifference = (createdAt: string, updatedAt: string) => {
    const createdDate = new Date(createdAt);
    const updatedDate = new Date(updatedAt);
    const timeDifference = updatedDate.getTime() - createdDate.getTime();

    const secondsDifference = Math.abs(Math.floor(timeDifference / 1000));

    if (secondsDifference < 60) {
      return `${secondsDifference} seconds`;
    } else if (secondsDifference < 3600) {
      const minutes = Math.floor(secondsDifference / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""}`;
    } else {
      const hours = Math.floor(secondsDifference / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
  };

  return (
    <>
      <Separator className="my-4" />
      <div className="pb-8">
        <h2 className="text-2xl font-semibold tracking-tight">Live History</h2>
        <Separator className="my-4" />
        <div className="grid grid-cols-6 items-center px-4 text-md font-medium">
          <div>Title</div>
          <div>Genre</div>
          <div>views</div>
          <div>With</div>
          <div>Duration</div>
          <div className="flex justify-center">Date</div>
        </div>
        <Separator className="my-4" />
        {loading ? (
          Array.from({ length: 10 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-full bg-gray-300 mb-4 rounded-md"
            />
          ))
        ) : (
          <>
            {liveHistory?.length === 0 && (
              <div className="my-4">No live history found!</div>
            )}
            {liveHistory?.map((history, index) => (
              <>
                <div
                  key={history.id}
                  className="grid grid-cols-6 bg-gray-700 border-b-2 border-white px-4 py-2 rounded-md space-y-2 items-center"
                >
                  <div>
                    {index + 1}.&nbsp;{history.title}
                  </div>
                  <div>{history.genres.join(", ")}</div>
                  <div>{history.views}</div>
                  <div className="flex items-center flex-wrap">
                    {history.participants?.map((participant: any) => (
                      <div key={participant.id}>
                        {participant.participant.name}
                      </div>
                    ))}
                  </div>
                  <div>
                    {calculateTimeDifference(
                      history.createdAt,
                      history.updatedAt
                    )}
                  </div>
                  <div className="flex justify-center">
                    {formatDate(history.createdAt)}
                  </div>
                </div>
              </>
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default LiveHistory;
