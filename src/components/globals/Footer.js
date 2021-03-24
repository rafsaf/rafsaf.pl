import React from "react";
import styled from "styled-components";
import { setColor } from "../../styles";
import { AiOutlineMail } from "react-icons/ai";

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

  h4 {
    font-weight: 300;
    text-transform: uppercase;
  }
  h3 {
    padding-bottom: 1.5rem;
    font-weight: 400;
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

const Footer = () => {
  return (
    <FooterContainer>
      <div>
        <h3>
          <AiOutlineMail /> rafal.safin12@gmail.com
        </h3>
        <h4>Powered by Gatsby.js with Headless cms Prismic.io</h4>
        <h4>2021 &#169; rafsaf.pl</h4>
      </div>
    </FooterContainer>
  );
};

export default Footer;
