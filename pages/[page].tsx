import { GetStaticPaths, GetStaticProps } from "next";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { Layout, PostTitle, SinglePost } from "../components";
import { getAllPagesWithSlug, getPage } from "../lib/api";

export default function Page({ page }) {
  const { isFallback } = useRouter();

  if (!isFallback && !page?.slug) {
    return <ErrorPage statusCode={404} />;
  }

  return (
    <Layout>
      {isFallback ? (
        <PostTitle>Loading…</PostTitle>
      ) : (
        <SinglePost post={page} />
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const data = await getPage(params?.page);

  return {
    props: { page: data },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const allPages = await getAllPagesWithSlug();

  return {
    paths: allPages.edges.map(({ node }) => `/${node.slug}`) || [],
    fallback: true,
  };
};