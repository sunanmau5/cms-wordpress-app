import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { MainAnimation } from "@/components/main-animation";
import { Meta } from "@/components/meta";

interface ILayoutProps {
  refererPathname?: string;
  children: React.ReactNode;
}

export default function Layout({ refererPathname, children }: ILayoutProps) {
  return (
    <div className="relative h-screen">
      <Meta />
      <Header />
      <MainAnimation refererPathname={refererPathname}>
        {children}
      </MainAnimation>
      <Footer />
    </div>
  );
}
Layout.displayName = "Layout";

export { Layout };
