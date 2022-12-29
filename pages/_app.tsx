import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { Global } from "./../components/globals/GlobalStyle";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Head>
        <title>Rafał Safin</title>
        <meta name="description" content="Rafał Safin portfolio" />
        <link
          href="https://fonts.googleapis.com/css2?family=Courgette&family=Lato:ital,wght@0,300;0,400;1,300;1,400&family=Roboto+Mono:wght@200;300&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/ico.png" />
      </Head>
      <Global />
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
