import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface IPostTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
}

function PostTitle({ title, className, ...props }: IPostTitleProps) {
  return (
    <h1
      className={cn(
        "text-3xl font-bold rotate-180 origin-center my-auto",
        className,
      )}
      style={postTitleStyle}
      {...props}
    >
      {title}
    </h1>
  );
}
PostTitle.displayName = "PostTitle";

const postTitleStyle: HTMLAttributes<HTMLHeadingElement>["style"] = {
  lineHeight: 0.7,
  writingMode: "vertical-rl",
};

export { PostTitle };
