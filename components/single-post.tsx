import PostBody from "./post-body";
import PostHeader from "./post-header";

export default function SinglePost({ post }) {
  return (
    <article>
      <PostHeader title={post.title} />
      <PostBody content={post.content} />
    </article>
  );
}
