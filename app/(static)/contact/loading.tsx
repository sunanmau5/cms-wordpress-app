import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <>
      <div className="flex flex-shrink-0 grow flex-col space-y-4 sm:w-5/12 sm:grow-0">
        <div className="space-y-6 mt-1">
          <div className="flex space-x-4">
            <div className="space-y-2.5 flex-1">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-full h-10" />
            </div>
            <div className="space-y-2.5 flex-1">
              <Skeleton className="w-20 h-4" />
              <Skeleton className="w-full h-10" />
            </div>
          </div>
          <div className="space-y-2.5 flex-1">
            <Skeleton className="w-16 h-4" />
            <Skeleton className="w-full h-10" />
          </div>
          <div className="space-y-2.5 flex-1">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-3/4 h-4" />
          </div>
          <div className="space-y-2.5 flex-1">
            <Skeleton className="w-20 h-4" />
            <Skeleton className="w-full h-36" />
            <Skeleton className="w-16 h-4" />
          </div>
          <div className="space-y-2.5 flex-1">
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 grow-0 sm:grow flex-col space-y-4 sm:w-5/12">
        <Skeleton className="h-[22.5rem] sm:h-1/2" />
      </div>
    </>
  );
}
