import { getAllPostsForOtherWorks } from "@/lib/api";

import { Layout } from "@/components/layout";
import { SinglePost } from "@/components/single-post";

export default async function OtherWorks() {
  const { edges } = await getAllPostsForOtherWorks();

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
