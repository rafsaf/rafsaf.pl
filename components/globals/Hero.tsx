import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { setColor } from "../../styles";
import { GiArrowDunk } from "react-icons/gi";
import HeroImage from "../../public/hero_small.webp";

const HeroContainer = styled.header`
  #profile-picture {
    display: inline-block;
    width: 18rem;
    height: 18rem;
  }
  #hero-picture {
    object-fit: cover;
    filter: brightness(18%);
  }

  section {
    position: "absolute";
    height: "100%";
    width: "100%";
    z-index: -2;
  }
  small {
    margin-top: 0;
    display: block;
    font-size: 0.6rem;
    color: ${setColor.mainWhite};
  }
  h2 {
    text-transform: none;
    text-align: center;
    margin-top: 2rem;
    color: ${setColor.mainWhite};
    display: block;
    span {
      font-size: 0.9rem;
    }
  }
  p {
    font-size: 1.2rem;
    margin-top: 2rem;
    max-width: 85vw;
    text-transform: none;
    text-align: center;
    color: ${setColor.mainWhite};
    letter-spacing: 0.08rem;
    display: block;
  }
  position: relative;
  padding: 3rem 0 8rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 1rem solid ${setColor.mainGrey};
  @media (min-width: 992px) {
    p {
      max-width: 50vw;
    }
    #profile-picture {
      width: 25rem;
      height: 25rem;
    }
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

const Hero: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const scrollToSkills = () => {
    const skillsElement = document.getElementById("skills");
    skillsElement?.scrollIntoView();
  };
  return (
    <HeroContainer id="hero">
      <section>
        <Image
          id="hero-picture"
          src={HeroImage}
          alt="Hero image"
          placeholder="blur"
          fill
        />
      </section>

      <Circle>
        <GiArrowDunk onClick={scrollToSkills} />
      </Circle>
      {children}
    </HeroContainer>
  );
};

export default Hero;
