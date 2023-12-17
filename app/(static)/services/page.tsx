import { useRefererPathname } from "@/hooks/use-referer-pathname";

import { Layout } from "@/components/layout";

// TODO: make services page

export default async function Services() {
  const pathname = useRefererPathname();

  return (
    <Layout refererPathname={pathname}>
      <div className="mt-4 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20">
        Implement me
      </div>
    </Layout>
  );
}
