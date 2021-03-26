import React from "react";
import { Global } from "./globals/GlobalStyle";
import styled from "styled-components";
import Navbar from "./globals/Navbar";
import Footer from "./globals/Footer";
import { Helmet } from "react-helmet";

const Wrapper = styled.div`
  min-height: 100vh;
  position: relative;
  top: calc(45px + 1.6rem);
  @media (min-width: 992px) {
    top: 45px;
  }
`;

const layout = ({ children }) => {
  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
      </Helmet>
      <Global />
      <Navbar />
      <Wrapper>{children}</Wrapper>
      <Footer />
    </main>
  );
};

export default layout;
