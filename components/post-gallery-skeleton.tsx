import { GALLERY_HEIGHT } from "@/lib/constants";

import { Skeleton } from "@/components/ui/skeleton";

import { Wrapper } from "@/components/wrapper";

function PostGallerySkeleton() {
  return (
    <Wrapper>
      <div
        className={`${GALLERY_HEIGHT} pl-4 sm:pl-8 2xl:pl-0 w-full flex items-center gap-4 overflow-auto no-scrollbar`}
      >
        <Skeleton className="h-80 w-8 2xl:w-5 flex-shrink-0" />
        <div className="flex gap-4 size-full">
          <Skeleton className="w-[20rem] sm:w-[40rem] shrink-0" />
          <Skeleton className="w-[20rem] sm:w-[40rem] shrink-0" />
          <Skeleton className="w-[20rem] sm:w-[40rem] shrink-0" />
          <Skeleton className="w-[20rem] sm:w-[40rem] shrink-0" />
        </div>
      </div>
    </Wrapper>
  );
}

export { PostGallerySkeleton };
