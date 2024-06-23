import { getAllPostsForPortfolio } from "@/lib/api";

import { VisiblePost } from "@/components/visible-post";

export default async function Portfolio() {
  const { edges } = await getAllPostsForPortfolio();

  if (edges.length === 0) {
    return null;
  }

  return <VisiblePost edges={[...edges, ...edges]} />;
}
