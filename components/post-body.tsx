import styles from "./post-body.module.css";

export interface IPost {
  title: string;
  content: string;
}

export default function PostBody({ content }: IPost) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className={styles.content}
    />
  );
}
