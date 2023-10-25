import { GetStaticProps } from "next";
import Head from "next/head";
import { getAllPostsForPortfolio } from "../lib/api";
import { Layout, SinglePost } from "../components";

export default function Index({ allPosts: { edges } }) {
  return (
    <Layout>
      <Head>
        <title>RINA WOLF</title>
      </Head>
      {edges.length > 0 ? (
        <>
          {edges.map(({ node }) => (
            //
            //
            <SinglePost key={node.slug} post={node} />
          ))}
        </>
      ) : null}
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
