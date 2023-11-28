import Head from "next/head";

import { HOME_OG_IMAGE_URL } from "../lib/constants";

export default function Meta() {
  return (
    <Head>
      <link
        href="/favicon/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="/favicon/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="/favicon/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link href="/favicon/site.webmanifest" rel="manifest" />
      <link
        color="#000000"
        href="/favicon/safari-pinned-tab.svg"
        rel="mask-icon"
      />
      <link href="/favicon/favicon.ico" rel="shortcut icon" />
      <meta content="#000000" name="msapplication-TileColor" />
      <meta content="/favicon/browserconfig.xml" name="msapplication-config" />
      <meta content="#000" name="theme-color" />
      <link href="/feed.xml" rel="alternate" type="application/rss+xml" />
      <meta content={HOME_OG_IMAGE_URL} property="og:image" />
      <title>RINA WOLF</title>
    </Head>
  );
}
