import { MainAnimation } from "@/components/main-animation";
import { Meta } from "@/components/meta";

import { ProgressBar } from "./progress-bar";

interface ILayoutProps {
  refererPathname?: string;
  children: React.ReactNode;
}

export default function Layout({ refererPathname, children }: ILayoutProps) {
  return (
    <div className="relative h-full">
      <Meta />
      <MainAnimation refererPathname={refererPathname}>
        {children}
      </MainAnimation>
      <ProgressBar />
    </div>
  );
}
Layout.displayName = "Layout";

export { Layout };
