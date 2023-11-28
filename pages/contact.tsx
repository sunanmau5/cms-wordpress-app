import { GetStaticProps } from "next";

import { Layout } from "../components";
import ContactForm from "../components/contact-form";
import { getPage } from "../lib/api";

const extractTextFromContent = (content: string) => {
  // Remove line breaks
  const text = content.replace(/(\r\n|\n|\r)/gm, " ");
  // Remove HTML tags
  return text.replace(/<[^>]*>/gm, "");
};

export default function Contact({ page }) {
  return (
    <Layout>
      <div className="flex gap-12 px-20">
        <ContactForm />
        <p className="w-1/2 flex-1">{extractTextFromContent(page.content)}</p>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const data = await getPage("contact");

  return {
    props: { page: data },
    revalidate: 10,
  };
};
