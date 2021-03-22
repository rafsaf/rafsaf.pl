import React from "react";
import { Global } from "./globals/GlobalStyle";
import styled from "styled-components";
import Navbar from "./globals/Navbar";
import Footer from "./globals/Footer";
import { Helmet } from "react-helmet";

const Wrapper = styled.div`
  min-height: 100vh;
`;

const layout = ({ children }) => {
  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Courgette&family=Lato&family=Roboto+Mono:ital,wght@1,200&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Global />
      <Navbar />
      <Wrapper>{children}</Wrapper>
      <Footer />
    </main>
  );
};

export default layout;
