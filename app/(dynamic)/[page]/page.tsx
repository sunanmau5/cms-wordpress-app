import { getAllPagesWithSlug, getPage } from "@/lib/api";

import { useRefererPathname } from "@/hooks/use-referer-pathname";

import { Layout } from "@/components/layout";
import { PostBody } from "@/components/post-body";

export const dynamicParams = true;

export async function generateStaticParams() {
  const { edges } = await getAllPagesWithSlug();
  const params = edges.map(({ node }) => ({ page: node.slug }));
  return params;
}

export default async function WPPage({ params }) {
  const { page } = params;
  const data = await getPage(page);

  const pathname = useRefererPathname();

  if (!data) {
    return null;
  }

  return (
    <Layout refererPathname={pathname}>
      <PostBody content={data.content} title={data.title} />
    </Layout>
  );
}
