import React from "react";
import Layout from "../components/layout";
import { Helmet } from "react-helmet";

const projects = () => {
  return (
    <Layout>
      <Helmet>
        <title>Rafał Safin | Projekty</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Helmet>
      projects
    </Layout>
  );
};

export default projects;
