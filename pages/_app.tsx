import type { AppProps } from "next/app";
import Layout from "../components/layout";
import Head from "next/head";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <Layout>
      <Head>
        <title>Rafał Safin</title>
        <meta name="description" content="Rafał Safin portfolio" />
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
};

export default MyApp;
