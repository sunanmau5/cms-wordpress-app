import { headers } from "next/headers";

export const useRefererPathname = (): string | undefined => {
  const headersList = headers();
  const referer = headersList.get("referer");
  if (referer) {
    const { pathname } = new URL(referer);
    return pathname;
  }
  return undefined;
};
