import React from "react";
import styled from "styled-components";
import { setColor } from "../../styles";

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
        <h4>Site created with Gatsby.js</h4>
        <h4>2020 &#169; rafsaf.pl</h4>
      </div>
    </FooterContainer>
  );
};

export default Footer;
