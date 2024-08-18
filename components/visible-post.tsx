"use client";

import { PostGallery } from "./post-gallery";
import { PostTitle } from "./post-title";
import { Wrapper } from "./wrapper";

type IVisiblePostProps = {
  node: {
    title: string;
    content: string;
  };
};

function VisiblePost({ node }: IVisiblePostProps) {
  return (
    <Wrapper>
      <PostTitle className="hidden 2xl:block" title={node.title} />
      <PostGallery post={node} />
    </Wrapper>
  );
}

VisiblePost.displayName = "VisiblePost";

export { VisiblePost };
