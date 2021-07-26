import React from "react";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";
import Hero from "../components/globals/Hero";
import { ButtonLink } from "../components/globals/Button";
import Skills from "../components/index/skills";
import TimeLine from "../components/index/timeline";

const index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Rafał Safin | Home Page</title>
        <meta name="description" content="Rafał Safin portfolio home page" />
      </Helmet>
      <Hero>
        <div>
          <h1>Full-stack Developer</h1>
          <ButtonLink big to="/projects">
            See Projects
          </ButtonLink>
        </div>
      </Hero>
      <Skills />
      <TimeLine />
    </Layout>
  );
};

export default index;
