import { GetStaticProps } from "next";

import { Layout, SinglePost } from "../components";
import { getAllPostsForOtherWorks } from "../lib/api";

export default function OtherWorks({ allPosts: { edges } }) {
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

export const getStaticProps: GetStaticProps = async () => {
  const allPosts = await getAllPostsForOtherWorks();

  return {
    props: { allPosts },
    revalidate: 10,
  };
};
