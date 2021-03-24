import React from "react";
import styled from "styled-components";
import Img from "gatsby-image";
import { setColor } from "../../styles";

const Card = styled.a`
  display: block;
  min-height: 20rem;
  width: 100%;
  margin: 2rem auto;
  background: ${setColor.primaryColor3};
  color: ${setColor.mainWhite};
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  transition: 0.3s linear;
  cursor: pointer;
  &:hover {
    transform: scale(1.02);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
  @media (min-width: 768px) {
    margin: 0 auto;
  }
`;
const ImageWrapper = styled.div`
  position: relative;
  div {
    height: 17rem;
  }
  section {
    position: absolute;
    right: 0;
    background: ${setColor.primaryColor};
    bottom: 0;
    padding: 0.3rem 0.8rem;
    color: ${setColor.mainBlack};
  }
`;

const Content = styled.section`
  padding: 1.5rem 1rem;
  font-size: 1.1rem;
  h3 {
    letter-spacing: 0.4rem;
    text-transform: uppercase;
  }
  @media (min-width: 768px) {
    height: 25rem;
  }
  @media (min-width: 992px) {
    height: 21rem;
  }
  @media (min-width: 1178px) {
    height: 17rem;
  }
`;

const Project = ({ img, title, href, text, desc }) => {
  return (
    <Card href={href} target="_blank" rel="noreferrer">
      <ImageWrapper>
        <Img fluid={img.fluid} alt="" />
        <section>{desc}</section>
      </ImageWrapper>
      <Content>
        <h3>{title}</h3>
        <p>{text}</p>
      </Content>
    </Card>
  );
};

export default Project;
