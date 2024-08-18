import { getAllPostsForOtherWorks } from "@/lib/api";

import { Scroll } from "@/components/scroll";
import { VisiblePost } from "@/components/visible-post";

export default async function OtherWorks() {
  const { edges } = await getAllPostsForOtherWorks();

  if (edges.length === 0) {
    return null;
  }

  return (
    <Scroll navigation={false} scrollableIndicator={false}>
      {edges.map((edge, index) => (
        //
        //
        <VisiblePost key={`${edge.node.title}-${index}`} node={edge.node} />
      ))}
    </Scroll>
  );
}
