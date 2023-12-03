import { Layout } from "@/components/layout";
import { PostTitle } from "@/components/post-title";

// TODO: make services page

export default async function Services() {
  return (
    <Layout>
      <PostTitle title="Services" />
      <div className="mt-4 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20">
        Implement me
      </div>
    </Layout>
  );
}
