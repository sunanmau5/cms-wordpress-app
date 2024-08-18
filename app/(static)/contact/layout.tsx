export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="sm:my-6 flex flex-col-reverse gap-12 px-4 sm:flex-row sm:px-20 2xl:px-80">
      {children}
    </div>
  );
}
