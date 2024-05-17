import React from "react";
import styled from "styled-components";
import { setColor } from "../../styles";
import { Icons } from "./Navbar";
const Footer = () => {
  return (
    <FooterContainer>
      <div>
        <h3>Contact</h3>
        <p>Email: rafal.safin@rafsaf.pl</p>
        {Icons.map((item, index) => (
          <a
            key={index}
            href={item.url}
            aria-label="social media icon"
            target="_blank"
            rel="noreferrer"
          >
            {item.icon}
          </a>
        ))}
        <p>
          Source code{" "}
          <a
            href="https://github.com/rafsaf/rafsaf.pl"
            target={"_blank"}
            aria-label="link to source code on github"
            rel={"noreferrer noopener"}
          >
            can be found here
          </a>
          .
        </p>
        <p>2021-{new Date().getFullYear()} &#169; rafsaf.pl</p>
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
  p {
    a {
      color: ${setColor.mainWhite};
      text-decoration: underline;
    }
  }
  h3 {
    padding-bottom: 0.5rem;
    padding-top: 1rem;
    font-weight: 400;

    @media (max-width: 578px) {
      font-size: 1rem;
    }
    text-transform: none;
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
