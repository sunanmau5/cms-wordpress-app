"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { kebabCase } from "lodash";
import Image from "next/image";

import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_MARGIN,
  DESKTOP_HEADER_FOOTER_HEIGHT,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import { ArrowButton } from "@/components/arrow-button";

import { PostTitle } from "./post-title";

import { extractSrcFromContent } from "@/utils/extract-src-from-content";

interface Post {
  title: string;
  content: string;
}

interface PostGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post;
}

const useGalleryDimensions = () => {
  const [dimensions, setDimensions] = useState({
    height: DEFAULT_IMAGE_HEIGHT,
    width: 0,
  });

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window === "undefined") return;
      const headerFooterHeight = DESKTOP_HEADER_FOOTER_HEIGHT * 2;
      setDimensions((prev) => ({
        ...prev,
        height: window.innerHeight - headerFooterHeight,
      }));
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return {
    dimensions,
    setDimensions,
  };
};

const useIntersectionObserver = (elementId: string) => {
  const [isVisible, setIsVisible] = useState({ first: true, last: false });
  const firstRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: document?.querySelector(`#${elementId}`),
      rootMargin: "0px",
      threshold: 0.95,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.target === firstRef.current) {
          setIsVisible((prev) => ({ ...prev, first: entry.isIntersecting }));
        } else if (entry.target === lastRef.current) {
          setIsVisible((prev) => ({ ...prev, last: entry.isIntersecting }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);
    if (firstRef.current) observer.observe(firstRef.current);
    if (lastRef.current) observer.observe(lastRef.current);

    return () => observer.disconnect();
  }, [elementId]);

  return { firstRef, lastRef, isVisible };
};

const PostGallery = forwardRef<HTMLDivElement, PostGalleryProps>(
  ({ post, className, ...props }, ref) => {
    const galleryId = kebabCase(post.title.toLowerCase());
    const images = extractSrcFromContent(post.content);
    const { dimensions, setDimensions } = useGalleryDimensions();
    const containerRef = useRef<HTMLDivElement>(null);
    const { firstRef, lastRef, isVisible } = useIntersectionObserver(galleryId);

    const handleScroll = (direction: "prev" | "next") => {
      const scrollAmount =
        (dimensions.width || DEFAULT_IMAGE_WIDTH) + DEFAULT_MARGIN;
      containerRef.current?.scrollBy({
        left: direction === "prev" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        id={galleryId}
        {...props}
      >
        <ArrowButton
          className={cn(
            "hidden sm:flex",
            !isVisible.first ? "opacity-100" : "opacity-0",
          )}
          direction="left"
          onClick={() => handleScroll("prev")}
        />

        <div
          ref={containerRef}
          className="flex w-full flex-1 overflow-x-scroll scroll-smooth pr-4 sm:no-scrollbar sm:pr-20 2xl:pr-0"
        >
          <div
            ref={firstRef}
            className="inline-block w-0.5 flex-shrink-0 sm:w-7 2xl:w-0 mr-4 2xl:mr-0"
          />

          <PostTitle className="2xl:hidden mr-4" title={post.title} />

          {images.map((src, index) => (
            <Image
              key={src}
              ref={index === images.length - 1 ? lastRef : undefined}
              alt={`${galleryId}-${index}`}
              className={cn(
                "h-full w-[90vw] sm:w-auto object-contain",
                index < images.length - 1 && "mr-4",
              )}
              height={dimensions.height}
              onLoad={(e) => {
                if (index === 0) {
                  setDimensions((prev) => ({
                    ...prev,
                    width: (e.target as HTMLImageElement).offsetWidth,
                  }));
                }
              }}
              sizes="(max-width: 640px) 90vw, auto"
              src={src}
              style={{ height: dimensions.height, width: "auto" }}
              width={0}
            />
          ))}
        </div>

        <ArrowButton
          className={cn(
            "hidden sm:flex",
            !isVisible.last ? "opacity-100" : "opacity-0",
          )}
          onClick={() => handleScroll("next")}
        />
      </div>
    );
  },
);

PostGallery.displayName = "PostGallery";

export { PostGallery };
