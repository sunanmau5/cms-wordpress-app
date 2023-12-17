import { getPage } from "@/lib/api";

import { useRefererPathname } from "@/hooks/use-referer-pathname";

import { ContactForm } from "@/components/contact-form";
import { Layout } from "@/components/layout";

const extractTextFromContent = (content: string) => {
  // Remove line breaks
  const text = content.replace(/(\r\n|\n|\r)/gm, " ");
  // Remove HTML tags
  return text.replace(/<[^>]*>/gm, "");
};

export default async function Contact() {
  const data = await getPage("contact");
  const pathname = useRefererPathname();

  return (
    <Layout refererPathname={pathname}>
      <div className="my-6 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20">
        <ContactForm className="flex flex-1 flex-shrink-0 flex-col space-y-4 sm:w-1/2" />
        <p className="flex-1 sm:w-1/2">
          {extractTextFromContent(data.content)}
        </p>
      </div>
    </Layout>
  );
}
