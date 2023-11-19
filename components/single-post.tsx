import PostGallery from "./post-gallery";
import PostTitle from "./post-title";

type ISinglePost = {
  post: {
    title: string;
    content: string;
  };
  className?: string;
};

export default function SinglePost({ post, className }: ISinglePost) {
  return (
    <article className={className}>
      <PostTitle title={post.title} />
      <PostGallery post={post} />
    </article>
  );
}
