import { Layout, PostBody } from "../../components";
import { getAllPagesWithSlug, getPage } from "../../lib/api";

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
      <PostBody content={data.content} title={data.title} />
    </Layout>
  );
}
