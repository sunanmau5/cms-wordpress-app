function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="2xl:flex 2xl:pl-[17.75rem] 2xl:gap-4 2xl:pr-80">
      {children}
    </div>
  );
}

export { Wrapper };
