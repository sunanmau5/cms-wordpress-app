import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Index() {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/portfolio");
  }, [replace]);
  return null;
}
