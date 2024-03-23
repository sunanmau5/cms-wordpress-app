import { getAllPostsForPortfolio } from "@/lib/api";

import { SinglePost } from "@/components/single-post";

export default async function Portfolio() {
  const { edges } = await getAllPostsForPortfolio();

  if (edges.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col space-y-4">
      {edges.map(({ node }) => (
        //
        //
        <SinglePost key={node.slug} post={node} />
      ))}
    </div>
  );
}
