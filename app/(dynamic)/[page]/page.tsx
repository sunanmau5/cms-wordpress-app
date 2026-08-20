import { getAllPagesWithSlug, getPage } from "@/lib/api";

import { PostBody } from "@/components/post-body";

type PageParams = Promise<{ page: string }>;

export async function generateStaticParams() {
  const { edges } = await getAllPagesWithSlug();
  const params = edges.map(({ node }) => ({ page: node.slug }));
  return params;
}

export default async function WPPage({ params }: { params: PageParams }) {
  const { page } = await params;
  const data = await getPage(page);

  if (!data) {
    return null;
  }

  return <PostBody content={data.content} title={data.title} />;
}
