import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Removes line breaks and HTML tags from it, and returns the extracted text.
 *
 * @param {string} content - a `content` parameter of type string as input.
 * @returns Cleaned text without line breaks and HTML tags.
 */
export function extractTextFromContent(content: string) {
  // Remove line breaks
  const text = content.replace(/(\r\n|\n|\r)/gm, " ");
  // Remove HTML tags
  return text.replace(/<[^>]*>/gm, "");
}

/**
 * Extracts the first occurrence of an <img> tag from a given content string.
 *
 * @param {string} content - a `content` parameter of type string as input.
 * @returns the first `<img>` tag found in the provided content string, or null
 * if no image tag is found.
 */
export function extractImgTagFromContent(content: string) {
  const imgTagPattern = /<img\s.*?\/>/;
  const imgTagMatch = content.match(imgTagPattern);
  return imgTagMatch ? imgTagMatch[0] : null;
}

/**
 * Extracts <p> tags from a given content string.
 *
 * @param {string} content - a `content` parameter of type string as input.
 * @returns the `<p>` tags found in the provided content string, or null
 * if no paragraph tag is found.
 */
export function extractParagraphTagFromContent(content: string) {
  const pTagPattern = /<p>(.*?)<\/p>/g;
  const pTags = content.match(pTagPattern);
  return pTags ? pTags : [];
}