import React from "react";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";
import Hero from "../components/globals/Hero";
import { ButtonLink } from "../components/globals/Button";
import Skills from "../components/index/skills";

const index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Rafał Safin | Strona Główna</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Helmet>
      <Hero src="../images/tour-1.jpeg">
        <div>
          <h1>Fullstack Developer</h1>
          <ButtonLink big to="/projects">
            Zobacz projekty
          </ButtonLink>
        </div>
      </Hero>
      <Skills />
    </Layout>
  );
};

export default index;
