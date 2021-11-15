import React from "react";
import Layout from "../components/layout";
import Project from "../components/projects/Project";
import Others from "../components/projects/Other";
import Head from "next/head";
import styled from "styled-components";
import ProjectsData from "../data/Articles.json";
import OldsData from "../data/OldArticles.json";
const Wrapper = styled.div`
  width: 85vw;
  margin: 0 auto;
  padding: 2rem 0;
  padding-top: 0.3rem;
  max-width: 1278px;
  @media (min-width: 768px) {
    display: grid;
    padding-top: 2.5rem;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    row-gap: 2.5rem;
  }
`;

const Projects = () => {
  const projects: SingleProject[] = ProjectsData;
  const olds: SingleOldProject[] = OldsData;
  return (
    <>
      <Head>
        <title>Rafał Safin | Projects</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Head>
      <Wrapper>
        {projects.map((item, index) => (
          <Project key={index} item={item} />
        ))}
      </Wrapper>
      <Others items={olds} />
    </>
  );
};

export default Projects;

export interface SingleOldProject {
  data: {
    href: string;
    name: string;
  };
}

export interface SingleProject {
  data: {
    desc: string;
    href: string;
    text: string;
    title: string;
    avatar: string;
  };
}
