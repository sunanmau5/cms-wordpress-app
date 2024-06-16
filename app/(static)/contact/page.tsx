import { getPage } from "@/lib/api";
import { extractTextFromContent } from "@/lib/utils";

import { ContactForm } from "@/components/contact-form";

export default async function Contact() {
  const { content } = await getPage("contact");

  return (
    <div className="sm:my-6 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20 2xl:px-80">
      <ContactForm className="flex flex-shrink-0 grow flex-col space-y-4 sm:w-5/12 sm:grow-0" />
      <p className="grow sm:w-7/12 sm:grow-0">
        {extractTextFromContent(content)}
      </p>
    </div>
  );
}
