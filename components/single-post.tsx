import { cn } from "@/lib/utils";

import { PostGallery } from "@/components/post-gallery";
import { PostTitle } from "@/components/post-title";

type ISinglePost = {
  post: {
    title: string;
    content: string;
  };
  className?: string;
};

function SinglePost({ post, className }: ISinglePost) {
  return (
    <article className={cn("flex flex-col space-y-4", className)}>
      <PostTitle title={post.title} />
      <PostGallery post={post} />
    </article>
  );
}
SinglePost.displayName = "SinglePost";

export { SinglePost };
