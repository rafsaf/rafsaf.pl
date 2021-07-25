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
  text-align: center;
  border-bottom: 1rem solid ${setColor.mainGrey};
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
    background: ${setColor.mainGrey};
    border-top-left-radius: 50%;
    border-top-right-radius: 50%;
    z-index: 0;
    height: 3rem;
    width: 3rem;
    padding: 1rem;
    padding-bottom: 0;
    margin: 0;
    bottom: -0rem;
    left: 50%;
    transform: translate(-50%);
    box-sizing: content-box;
    cursor: pointer;
  }
  @media (min-width: 992px) {
    svg {
      height: 4rem;
      width: 4rem;
      padding: 1.5rem;
      padding-bottom: 0;
    }
    &:hover {
      svg {
        height: 4.2rem;
        width: 4.2rem;
        transition: 0.1s linear;
      }
    }
  }
`;

const Hero: React.FC<{children: React.ReactNode}> = ({ children }) => {
  return (
    <HeroContainer id="hero">
      <StaticImage
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: -2,
          filter: "brightness(80%)",
        }}
        src="../../images/hero.jpg"
        alt=""
        placeholder="blurred"
        layout="fullWidth"
      />
      <Circle>
        <GiArrowDunk
          onClick={() => {
            scrollTo("#skills", "end");
          }}
        />
      </Circle>
      {children}
    </HeroContainer>
  );
};

export default Hero;
