import styles from "./post-body.module.css";

interface IPost {
  title: string;
  content: string;
}

function PostBody({ content }: IPost) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className={styles.content}
    />
  );
}
PostBody.displayName = "PostBody";

export { PostBody };
