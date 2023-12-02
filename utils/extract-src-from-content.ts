// Description:
// This utils function takes a string of content and returns the src of all the images it finds.
// It is used to extract the src of images from the content of a post.
// Usage:
// import extractSrcFromContent from "utils/extract-src-from-content";
// const src = extractSrcFromContent(content);
// content is the content of a post, which is a string.
// src is an array of strings, each string is the src of an image.
// Example:
// const content = "<p>Here is an image: <img src="https://example.com/image.png" /></p>";
// const src = extractSrcFromContent(content);
// console.log(src); // ["https://example.com/image.png"]

export function extractSrcFromContent(content: string): string[] {
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  const matches = content.match(regex) || [];
  return matches.map((match) =>
    match.replace(/.*src=["']([^"']+)["'].*/, "$1"),
  );
}
