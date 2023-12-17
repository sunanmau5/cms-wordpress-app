"use client";

import { useEffect, useRef, useState } from "react";
import { kebabCase } from "lodash";
import Image from "next/image";

import {
  DEFAULT_IMAGE_WIDTH,
  DEFAULT_MARGIN,
  POST_TITLE_HEIGHT,
} from "@/lib/constants";

import { useElementOnScreen } from "@/hooks/use-element-on-screen";

import { ArrowButton } from "@/components/arrow-button";

import { extractSrcFromContent } from "@/utils/extract-src-from-content";

interface IPostGallery {
  post: {
    title: string;
    content: string;
  };
}

function PostGallery({ post }: IPostGallery) {
  const { content, title } = post;

  const _title = kebabCase(title.toLowerCase());

  const [config, setConfig] = useState<IntersectionObserverInit | undefined>();

  const [imageWidth, setImageWidth] = useState<number>(0);
  const images = extractSrcFromContent(content);

  const [firstRef, isFirstVisible] = useElementOnScreen<HTMLDivElement>(config);
  const [lastRef, isLastVisible] = useElementOnScreen<HTMLImageElement>(config);

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
    <div className="relative overflow-hidden" id={`${_title}-scroll-area`}>
      {showPrev ? (
        <ArrowButton direction="left" onClick={handlePrevClick} />
      ) : null}

      <div
        ref={containerRef}
        className="no-scrollbar flex w-full flex-1 space-x-4 overflow-x-scroll scroll-smooth"
      >
        {/* Empty div as first element ref */}
        <div
          ref={firstRef}
          className="inline-block w-0.5 flex-shrink-0 sm:w-16"
        >
          &nbsp;
        </div>

        {images.map((src, index) => (
          //
          //
          <Image
            key={src}
            ref={index === images.length - 1 ? lastRef : undefined}
            alt={`${_title}-${index}`}
            height="0"
            // Only get the width of the first image
            onLoad={(e) => {
              if (index === 0) {
                setImageWidth((e.target as HTMLImageElement).offsetWidth);
              }
            }}
            sizes="100vw"
            src={src}
            style={{
              width: "auto",
              // TODO: don't use magic numbers
              height: 691 - (POST_TITLE_HEIGHT + DEFAULT_MARGIN),
            }}
            width="0"
          />
        ))}
      </div>

      {showNext ? <ArrowButton onClick={handleNextClick} /> : null}
    </div>
  );
}
PostGallery.displayName = "PostGallery";

export { PostGallery };
