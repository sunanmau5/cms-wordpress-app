import { getAllPagesWithSlug, getPage } from "@/lib/api";

import { PostBody } from "@/components/post-body";

export async function generateStaticParams() {
  const { edges } = await getAllPagesWithSlug();
  const params = edges.map(({ node }) => ({ page: node.slug }));
  return params;
}

export default async function WPPage({ params }) {
  const { page } = params;
  const data = await getPage(page);

  if (!data) {
    return null;
  }

  return <PostBody content={data.content} title={data.title} />;
}
