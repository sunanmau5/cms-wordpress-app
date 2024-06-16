import { cn } from "@/lib/utils";

import { PostGallery } from "./post-gallery";
import { PostTitle } from "./post-title";

type ISinglePost = {
  post: {
    title: string;
    content: string;
  };
  className?: string;
};

function SinglePost({ post, className }: ISinglePost) {
  return (
    <article
      className={cn(
        "2xl:flex 2xl:pl-[17.75rem] 2xl:gap-4 2xl:pr-80",
        className,
      )}
    >
      <PostTitle className="hidden 2xl:block" title={post.title} />
      <PostGallery post={post} />
    </article>
  );
}
SinglePost.displayName = "SinglePost";

export { SinglePost };
