import { getAllPostsForPortfolio } from "@/lib/api";

import { useRefererPathname } from "@/hooks/use-referer-pathname";

import { Layout } from "@/components/layout";
import { SinglePost } from "@/components/single-post";

export default async function Portfolio() {
  const { edges } = await getAllPostsForPortfolio();

  const pathname = useRefererPathname();

  if (edges.length === 0) {
    return null;
  }

  return (
    <Layout refererPathname={pathname}>
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
