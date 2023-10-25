import styles from "./post-body.module.css";
import cx from "classnames";

export default function PostBody({ content }) {
  return (
    <div
      className={cx("no-scrollbar", styles.content)}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
