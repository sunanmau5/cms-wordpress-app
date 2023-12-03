import { getAllPagesWithSlug, getPage } from "@/lib/api";

import { Layout } from "@/components/layout";
import { PostBody } from "@/components/post-body";
import { PostTitle } from "@/components/post-title";

export const dynamicParams = true;

export async function generateStaticParams() {
  const { edges } = await getAllPagesWithSlug();
  const params = edges.map(({ node }) => ({ page: node.slug }));
  return params;
}

export default async function WPPage({ params }) {
  const { page } = params;
  const data = await getPage(page);

  return (
    <Layout>
      <PostTitle title={data.title} />
      <PostBody content={data.content} title={data.title} />
    </Layout>
  );
}
