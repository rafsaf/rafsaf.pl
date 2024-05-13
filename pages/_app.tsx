import type { AppProps } from "next/app";
import Layout from "../components/layout";
import { Global } from "./../components/globals/GlobalStyle";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Head>
        <link rel="shortcut icon" href="/ico.png" />
        <title>Rafał Safin</title>
        <meta name="description" content="Rafał Safin portfolio" />
      </Head>
      <Global />
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
