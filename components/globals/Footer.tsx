import React from "react";
import styled from "styled-components";
import { setColor } from "../../styles";
import { Icons } from "./Navbar";
const Footer = () => {
  return (
    <FooterContainer>
      <div>
        <h2>Rafał Safin</h2>
        <h3>rafal.safin@rafsaf.pl</h3>
        {Icons.map((item, index) => (
          <a key={index} href={item.url} target="_blank" rel="noreferrer">
            {item.icon}
          </a>
        ))}
        <h4>Powered by Next.js</h4>
        <h4>2021 &#169; rafsaf.pl</h4>
      </div>
    </FooterContainer>
  );
};

export default Footer;

const FooterContainer = styled.footer`
  background: ${setColor.mainBlack};
  position: relative;
  min-height: 20rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${setColor.mainWhite};
  text-align: center;
  letter-spacing: 0.3rem;
  svg {
    font-size: 2.6rem;
    margin: 0.5rem;
    margin-bottom: 1.5rem;
    color: ${setColor.mainWhite};
  }
  h4 {
    font-size: 0.8rem;
    text-transform: uppercase;
  }
  h3 {
    padding-bottom: 0.5rem;
    padding-top: 1rem;
    font-weight: 400;

    @media (max-width: 578px) {
      font-size: 1rem;
    }
    text-transform: lowercase;
  }
  div {
    width: 95vw;
  }
  @media screen and (min-width: 992px) {
    div {
      width: 85vw;
    }
  }
`;
