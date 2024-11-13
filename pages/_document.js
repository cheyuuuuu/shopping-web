import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="zh-tw" suppressHydrationWarning >
      <Head>
      <meta name="description" content="這是一個小型電商網站" />
      <meta name="keywords" content="咖啡豆" />
      <meta name="author" content="cheyu" />
      
      <link rel="icon" href="../favicon.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
