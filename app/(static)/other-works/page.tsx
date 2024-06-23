import { getAllPostsForOtherWorks } from "@/lib/api";

import { VisiblePost } from "@/components/visible-post";

export default async function OtherWorks() {
  const { edges } = await getAllPostsForOtherWorks();

  if (edges.length === 0) {
    return null;
  }

  return <VisiblePost edges={edges} />;
}
