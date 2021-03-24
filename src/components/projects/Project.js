import React from "react";
import styled from "styled-components";
import { getImage, GatsbyImage } from "gatsby-plugin-image";

const Card = styled.article`
  min-height: 15rem;
`;
const ImageWrapper = styled.div`
  height: 15rem;
  width: 100%;
`;

const Content = styled.div``;

const Project = ({ img }) => {
  const image = getImage(img);
  console.log(image);
  return (
    <Card>
      <ImageWrapper>
        <GatsbyImage image={image} alt="" />
      </ImageWrapper>
      <Content></Content>
    </Card>
  );
};

export default Project;
