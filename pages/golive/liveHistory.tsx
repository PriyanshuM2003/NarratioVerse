"use client";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import GetLiveTalkData from "@/routes/getLiveTalkData";

const LiveHistory = () => {
  const [liveHistory, setLiveHistory] = useState<any[]>([]);
  const { liveTalkHistoryData, loadingLiveTalkData } = GetLiveTalkData();

  useEffect(() => {
    if (liveTalkHistoryData) {
      setLiveHistory(liveTalkHistoryData);
    }
  }, [liveTalkHistoryData]);

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
        {loadingLiveTalkData ? (
          Array.from({ length: 10 }, (_, index) => (
            <Skeleton
              key={index}
              className="h-10 w-full bg-gray-300 mb-4 rounded-md"
            />
          ))
        ) : (
          <>
            {liveHistory.length === 0 && (
              <div className="my-4">No live history found!</div>
            )}
            {liveHistory.map((history, index) => (
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
