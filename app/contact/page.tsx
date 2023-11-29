import { Layout } from "../../components";
import { getPage } from "../../lib/api";

import { ContactForm } from "./components";

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
      <div className="flex gap-12 px-20">
        <ContactForm />
        <p className="w-1/2 flex-1">{extractTextFromContent(data.content)}</p>
      </div>
    </Layout>
  );
}
