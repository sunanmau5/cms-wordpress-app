import { Layout, SinglePost } from "../../components";
import { getAllPostsForPortfolio } from "../../lib/api";

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
