import React from "react";
import styled from "styled-components";
import { setColor } from "../styles";

const NotFoundHeader = styled.h2`
  color: ${setColor.mainBlack};
  text-align: center;
  padding-top: 1rem;
`;

const NotFoundPage = () => {
  return <NotFoundHeader>Page not Found</NotFoundHeader>;
};

export default NotFoundPage;
