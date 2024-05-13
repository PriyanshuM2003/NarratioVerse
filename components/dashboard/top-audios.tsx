import GetDashboardData from "@/routes/getDashboardData";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";

export function TopAudios() {
  const { topAudios, loadingDashboardData } = GetDashboardData();

  return (
    <div className="space-y-4">
      {loadingDashboardData ? (
        Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="flex items-center justify-between gap-2">
            <div className="flex items-center w-full gap-2">
              <Skeleton className="w-16 h-16" />
              <div className="flex flex-col w-full gap-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
            <Skeleton className="w-1/3 h-4" />
          </div>
        ))
      ) : (
        <>
          {topAudios?.map((audio) => (
            <>
              <div className="flex items-center">
                <Image
                  src={audio?.coverImage || ""}
                  alt={audio?.title}
                  width={16}
                  height={16}
                  className="w-16 h-16"
                />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {audio.title}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {audio.category}
                  </p>
                </div>
                <div className="ml-auto font-medium">{audio.streams}</div>
              </div>
            </>
          ))}
        </>
      )}
    </div>
  );
}
