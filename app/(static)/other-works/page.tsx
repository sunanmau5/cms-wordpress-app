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
      <div className="flex flex-col space-y-4">
        {edges.map(({ node }) => (
          //
          //
          <SinglePost key={node.slug} post={node} />
        ))}
      </div>
    </Layout>
  );
}
