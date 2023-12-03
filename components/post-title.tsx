import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface IPostTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  title: string;
}

function PostTitle({ title, className, ...props }: IPostTitleProps) {
  return (
    <h1
      className={cn("px-4 text-left text-3xl font-bold sm:px-20", className)}
      style={{ lineHeight: 0.7 }}
      {...props}
    >
      {title}
    </h1>
  );
}
PostTitle.displayName = "PostTitle";

export { PostTitle };
