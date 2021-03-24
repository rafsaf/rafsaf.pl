import React from "react";
import Layout from "../components/layout";
import Project from "../components/projects/Project";
import { Helmet } from "react-helmet";
import { graphql } from "gatsby";

const projects = ({ data }) => {
  console.log(data);
  return (
    <Layout>
      <Helmet>
        <title>Rafał Safin | Projects</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Helmet>
      {data.projects.nodes.map((item) => (
        <Project img={item.data.avatar.localFile} />
      ))}
    </Layout>
  );
};

export default projects;

export const query = graphql`
  {
    projects: allPrismicArticle {
      nodes {
        data {
          href
          text
          title
          avatar {
            localFile {
              childImageSharp {
                gatsbyImageData(width: 200)
              }
            }
          }
        }
      }
    }
  }
`;
