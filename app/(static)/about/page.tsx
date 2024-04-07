import { getPage } from "@/lib/api";
import {
  extractImgTagFromContent,
  extractParagraphTagFromContent,
} from "@/lib/utils";

export default async function About() {
  const { content } = await getPage("about");

  const imageTag = extractImgTagFromContent(content);
  const pTags = extractParagraphTagFromContent(content);

  return (
    <div className="my-6 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20">
      {imageTag && (
        <section
          dangerouslySetInnerHTML={{ __html: imageTag }}
          className="flex flex-shrink-0 grow flex-col space-y-4 sm:w-5/12 sm:grow-0"
        />
      )}
      {pTags && (
        <section
          dangerouslySetInnerHTML={{ __html: pTags.join("") }}
          className="grow sm:w-7/12 sm:grow-0"
        />
      )}
    </div>
  );
}
