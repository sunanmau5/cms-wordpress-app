import { headers } from "next/headers";

export const getRefererPathname = async (): Promise<string | undefined> => {
  const headersList = await headers();
  const referer = headersList.get("referer");
  if (referer) {
    const { pathname } = new URL(referer);
    return pathname;
  }
  return undefined;
};
