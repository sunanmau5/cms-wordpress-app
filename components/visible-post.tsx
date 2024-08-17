"use client";

import { PostGallery } from "./post-gallery";
import { PostTitle } from "./post-title";

type IVisiblePostProps = {
  node: {
    title: string;
    content: string;
  };
};

function VisiblePost({ node }: IVisiblePostProps) {
  return (
    <div className="2xl:flex 2xl:pl-[17.75rem] 2xl:gap-4 2xl:pr-80">
      <PostTitle className="hidden 2xl:block" title={node.title} />
      <PostGallery post={node} />
    </div>
  );
}

VisiblePost.displayName = "VisiblePost";

export { VisiblePost };
