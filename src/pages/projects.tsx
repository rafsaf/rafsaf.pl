import React from "react";
import Layout from "../components/layout";
import Project from "../components/projects/Project";
import Others from "../components/projects/Other";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { graphql } from "gatsby";

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

const projects: React.FC<{ data: Data }> = ({ data }) => {
  console.log(data);
  return (
    <Layout>
      <Helmet>
        <title>Rafał Safin | Projects</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Helmet>
      <Wrapper>
        {data.projects.nodes.map((item, index) => (
          <Project key={index} item={item} />
        ))}
      </Wrapper>
      <Others items={data.olds.nodes} />
    </Layout>
  );
};

export default projects;

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
    avatar: {
      fluid: any;
    };
  };
}

interface Data {
  projects: {
    nodes: SingleProject[];
  };
  olds: {
    nodes: SingleOldProject[];
  };
}

export const query = graphql`
  {
    projects: allPrismicArticle(
      sort: { order: DESC, fields: first_publication_date }
    ) {
      nodes {
        data {
          desc
          href
          text
          title
          avatar {
            fluid {
              ...GatsbyPrismicImageFluid
            }
          }
        }
      }
    }
    olds: allPrismicOldarticle {
      nodes {
        data {
          href
          name
        }
      }
    }
  }
`;
