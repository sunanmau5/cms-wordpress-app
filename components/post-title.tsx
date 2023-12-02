function PostTitle({ title }) {
  return (
    <h1
      className="mx-20 mb-4 mt-0 text-left text-3xl font-bold"
      style={{ lineHeight: 0.7 }}
    >
      {title}
    </h1>
  );
}
PostTitle.displayName = "PostTitle";

export { PostTitle };
