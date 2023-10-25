import { GetStaticProps } from "next";
import { getAllPostsForOtherWorks } from "../lib/api";
import { Layout, SinglePost } from "../components";

export default function OtherWorks({ allPosts: { edges } }) {
  return (
    <Layout>
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
  const allPosts = await getAllPostsForOtherWorks(preview);

  return {
    props: { allPosts, preview },
    revalidate: 10,
  };
};
