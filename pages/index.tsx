import React from "react";
import Layout from "../components/layout";
import Head from "next/head";
import Hero from "../components/globals/Hero";
import { ButtonLink } from "../components/globals/Button";
import Link from "next/link";
import Skills from "../components/index/skills";
import TimeLine from "../components/index/timeline";

const index = () => {
  return (
    <>
      <Head>
        <title>Rafał Safin | Home Page</title>
        <meta name="description" content="Rafał Safin portfolio home page" />
      </Head>
      <Hero>
        <div>
          <h1>Full-stack Developer</h1>
          <Link href="/projects" passHref>
            <ButtonLink big>See Projects</ButtonLink>
          </Link>
        </div>
      </Hero>
      <Skills />
      <TimeLine />
    </>
  );
};

export default index;
