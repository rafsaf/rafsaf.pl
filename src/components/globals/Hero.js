import React from "react";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";
import { setColor } from "../../styles";
import { GiArrowDunk } from "react-icons/gi";
import scrollTo from "gatsby-plugin-smoothscroll";

const HeroContainer = styled.header`
  position: relative;
  min-height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;

  border-bottom: 1.25rem solid ${setColor.border};
  h1 {
    text-align: center;
    color: ${setColor.mainWhite};
    display: block;
  }
`;

const Circle = styled.button`
  svg {
    position: absolute;
    color: ${setColor.light};
    background: ${setColor.border};
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    z-index: 0;
    height: 4rem;
    width: 4rem;
    padding: 1.5rem;
    padding-bottom: 0;
    margin: 0;
    bottom: -0rem;
    left: 50%;
    transform: translate(-50%);
    box-sizing: content-box;
    cursor: pointer;
  }
  &:hover {
    svg {
      height: 4.2rem;
      width: 4.2rem;
      transition: 0.1s linear;
    }
  }
`;

const Hero = ({ children }) => {
  return (
    <HeroContainer>
      <StaticImage
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: -2,
          filter: "brightness(95%)",
        }}
        src="../../images/hero.jpg"
        alt=""
        placeholder="blurred"
        layout="fullWidth"
      />
      <Circle>
        <GiArrowDunk
          onClick={() => {
            scrollTo("#skills");
          }}
        />
      </Circle>
      {children}
    </HeroContainer>
  );
};

export default Hero;
