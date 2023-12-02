import { getAllPostsForPortfolio } from "@/lib/api";

import { Layout } from "@/components/layout";
import { SinglePost } from "@/components/single-post";

export default async function Portfolio() {
  const { edges } = await getAllPostsForPortfolio();

  if (edges.length === 0) {
    return null;
  }

  return (
    <Layout>
      {edges.map(({ node }) => (
        //
        //
        <SinglePost key={node.slug} post={node} />
      ))}
    </Layout>
  );
}
