import { Layout, PostBody } from "../../components";
import { getAllPagesWithSlug, getPage } from "../../lib/api";

export const dynamicParams = true;

export async function generateStaticParams() {
  const allPages = await getAllPagesWithSlug();
  return allPages.edges.map(({ node }) => ({ page: node.slug })) || [];
}

export default async function WPPage({ page }) {
  const data = await getPage(page);

  return (
    <Layout>
      <PostBody content={data.content} title={data.title} />
    </Layout>
  );
}
