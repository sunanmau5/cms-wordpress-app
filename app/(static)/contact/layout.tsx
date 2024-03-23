import { useRefererPathname } from "@/hooks/use-referer-pathname";

import Layout from "@/components/layout";

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = useRefererPathname();
  return <Layout refererPathname={pathname}>{children}</Layout>;
}
