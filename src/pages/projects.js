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
  padding: 4rem 0;
  max-width: 1278px;
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }
`;

const projects = ({ data }) => {
  console.log(data);
  return (
    <Layout>
      <Helmet>
        <title>Rafał Safin | Projects</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Helmet>
      <Wrapper>
        {data.projects.nodes.map((item, index) => (
          <Project
            key={index}
            href={item.data.href}
            text={item.data.text}
            title={item.data.title}
            img={item.data.avatar}
            desc={item.data.desc}
          />
        ))}
      </Wrapper>
      <Others items={data.olds.nodes} />
    </Layout>
  );
};

export default projects;

export const query = graphql`
  {
    projects: allPrismicArticle {
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
