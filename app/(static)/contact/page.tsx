import { getPage } from "@/lib/api";

import { ContactForm } from "@/components/contact-form";
import { Layout } from "@/components/layout";
import { PostTitle } from "@/components/post-title";

const extractTextFromContent = (content: string) => {
  // Remove line breaks
  const text = content.replace(/(\r\n|\n|\r)/gm, " ");
  // Remove HTML tags
  return text.replace(/<[^>]*>/gm, "");
};

export default async function Contact() {
  const data = await getPage("contact");

  return (
    <Layout>
      <PostTitle title="Contact" />
      <div className="mt-4 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20">
        <ContactForm className="flex flex-1 flex-shrink-0 flex-col space-y-4 sm:w-1/2" />
        <p className="flex-1 sm:w-1/2">
          {extractTextFromContent(data.content)}
        </p>
      </div>
    </Layout>
  );
}
