import { GetStaticProps } from "next";
import { Layout, SinglePost } from "../components";
import { getAllPostsForPortfolio } from "../lib/api";

export default function Portfolio({ allPosts: { edges } }) {
  if (edges.length === 0) {
    return null;
  }

  return (
    <Layout>
      {edges.map(({ node }) => (
        //
        //
        <SinglePost key={node.slug} className="snap-start" post={node} />
      ))}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allPosts = await getAllPostsForPortfolio(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
