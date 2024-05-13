import React from "react";
import styled from "styled-components";
import Navbar from "./globals/Navbar";
import Footer from "./globals/Footer";
import StyledComponentsRegistry from "./../lib/registry";

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main>
      <StyledComponentsRegistry>
        <Navbar />
        <Wrapper>{children}</Wrapper>
        <Footer />
      </StyledComponentsRegistry>
    </main>
  );
};

export default layout;

const Wrapper = styled.div`
  min-height: 100vh;
  position: relative;
  top: calc(45px + 0.6rem);
  @media (min-width: 992px) {
    top: 45px;
  }
`;
