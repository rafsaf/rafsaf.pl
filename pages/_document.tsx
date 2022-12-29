import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Courgette&family=Lato:ital,wght@0,300;0,400;1,300;1,400&family=Roboto+Mono:wght@200;300&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/ico.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
