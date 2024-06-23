"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import React from "react";
import { kebabCase } from "lodash";
import Image from "next/image";

import {
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_MARGIN,
  DESKTOP_HEADER_FOOTER_HEIGHT,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

import { useElementOnScreen } from "@/hooks/use-element-on-screen";

import { ArrowButton } from "@/components/arrow-button";

import { PostTitle } from "./post-title";

import { extractSrcFromContent } from "@/utils/extract-src-from-content";

interface IPostGallery extends React.HTMLAttributes<HTMLDivElement> {
  post: {
    title: string;
    content: string;
  };
}

const PostGallery = forwardRef<HTMLDivElement, IPostGallery>(
  ({ post, className, ...props }, ref) => {
    const { content, title } = post;
    const _title = kebabCase(title.toLowerCase());

    const [config, setConfig] = useState<
      IntersectionObserverInit | undefined
    >();

    const [imageHeight, setImageHeight] = useState(DEFAULT_IMAGE_HEIGHT);
    const [imageWidth, setImageWidth] = useState<number>(0);
    const images = extractSrcFromContent(content);

    const [firstRef, isFirstVisible] =
      useElementOnScreen<HTMLDivElement>(config);
    const [lastRef, isLastVisible] =
      useElementOnScreen<HTMLImageElement>(config);

    const containerRef = useRef<HTMLDivElement>(null);
    const [showPrev, setShowPrev] = useState<boolean>(false);
    const [showNext, setShowNext] = useState<boolean>(true);

    useEffect(() => {
      setConfig({
        root: document?.querySelector(`#${_title}-scroll-area`),
        rootMargin: "0px",
        threshold: 0.95,
      });
    }, [_title]);

    useEffect(() => {
      setShowPrev(!isFirstVisible);
    }, [isFirstVisible]);

    useEffect(() => {
      setShowNext(!isLastVisible);
    }, [isLastVisible]);

    useEffect(() => {
      const updateHeight = () => {
        if (typeof window !== "undefined") {
          setImageHeight(window.innerHeight - DESKTOP_HEADER_FOOTER_HEIGHT * 2);
        }
      };

      // Initial height calculation
      updateHeight();

      // Update height on window resize
      window.addEventListener("resize", updateHeight);
      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }, []);

    const handlePrevClick = () => {
      containerRef.current?.scrollBy({
        left: -((imageWidth ?? DEFAULT_IMAGE_WIDTH) + DEFAULT_MARGIN),
        behavior: "smooth",
      });
    };

    const handleNextClick = () => {
      containerRef.current?.scrollBy({
        left: (imageWidth ?? DEFAULT_IMAGE_WIDTH) + DEFAULT_MARGIN,
        behavior: "smooth",
      });
    };

    return (
      <div
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        id={`${_title}-scroll-area`}
        {...props}
      >
        <ArrowButton
          className={showPrev ? "opacity-100" : "opacity-0"}
          direction="left"
          onClick={handlePrevClick}
        />

        <div
          ref={containerRef}
          className="no-scrollbar flex w-full flex-1 overflow-x-scroll scroll-smooth pr-4 sm:pr-20 2xl:pr-0"
        >
          {/* Empty div as first element ref */}
          <div
            ref={firstRef}
            className="inline-block w-0.5 flex-shrink-0 sm:w-7 2xl:w-0 mr-4 2xl:mr-0"
          >
            &nbsp;
          </div>

          <PostTitle className="2xl:hidden mr-4" title={post.title} />
          {images.map((src, index) => (
            //
            //
            <Image
              key={src}
              ref={index === images.length - 1 ? lastRef : undefined}
              alt={`${_title}-${index}`}
              className={index === images.length - 1 ? undefined : "mr-4"}
              height="0"
              onLoad={(e) => {
                // Only get the width of the first image
                if (index === 0) {
                  setImageWidth((e.target as HTMLImageElement).offsetWidth);
                }
              }}
              sizes="100vw"
              src={src}
              style={{ width: "auto", height: imageHeight }}
              width="0"
            />
          ))}
        </div>

        <ArrowButton
          className={showNext ? "opacity-100" : "opacity-0"}
          onClick={handleNextClick}
        />
      </div>
    );
  },
);
PostGallery.displayName = "PostGallery";

export { PostGallery };
