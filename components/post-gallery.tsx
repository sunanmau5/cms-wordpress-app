import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useElementOnScreen } from "../hooks";
import { useImageHeightContext } from "../providers";
import { extractSrcFromContent } from "../utils";
import ArrowButton from "./arrow-button";
import { IPost } from "./post-body";

const POST_TITLE_HEIGHT = 21;
const DEFAULT_MARGIN = 16;
const DEFAULT_IMAGE_WIDTH = 436;

interface IPostGallery {
  post: IPost;
}

export default function PostGallery({ post }: IPostGallery) {
  const { content, title } = post;

  const _title = title.toLowerCase();

  const config = {
    root: document?.querySelector(`#${_title}-scroll-area`),
    rootMargin: "0px",
    threshold: 0.95,
  };

  const { imageHeight } = useImageHeightContext();
  const [imageWidth, setImageWidth] = useState<number>(0);
  const images = extractSrcFromContent(content);

  const [firstRef, isFirstVisible] = useElementOnScreen<HTMLDivElement>(config);
  const [lastRef, isLastVisible] = useElementOnScreen<HTMLImageElement>(config);

  const containerRef = useRef<HTMLDivElement>(null);
  const [showPrev, setShowPrev] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(true);

  console.log({ imageHeight, imageWidth });
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
        className="no-scrollbar flex w-full flex-1 gap-4 overflow-x-scroll scroll-smooth"
      >
        {/* Empty div as first element ref */}
        <div ref={firstRef} className="inline-block w-16 flex-shrink-0">
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
              height: imageHeight - (POST_TITLE_HEIGHT + DEFAULT_MARGIN),
            }}
            width="0"
          />
        ))}
      </div>

      {showNext ? <ArrowButton onClick={handleNextClick} /> : null}
    </div>
  );
}
