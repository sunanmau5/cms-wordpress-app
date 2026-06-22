import { getRefererPathname } from "@/hooks/use-referer-pathname";

import Layout from "@/components/layout";

export default async function DynamicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = await getRefererPathname();
  return <Layout refererPathname={pathname}>{children}</Layout>;
}
