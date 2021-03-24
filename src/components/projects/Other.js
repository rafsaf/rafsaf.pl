import React from "react";
import styled from "styled-components";
import { setColor, setFont } from "../../styles";

const OtherWrapper = styled.article`
  width: 90vw;
  margin: 0rem auto;
  padding: 2rem 0;
  padding-bottom: 10rem;
  max-width: 992px;
  h2 {
    color: ${setColor.mainBlack};
    ${setFont.roboto};
    padding: 1rem 0;
  }
  h4 {
    a {
      color: ${setColor.blue};
    }
    font-weight: 400;
    font-size: 1.6rem;
    text-transform: none;
    padding: 0.4rem 0;
  }
  h4:hover {
    color: ${setColor.mainGrey};
  }
`;

const Others = ({ items }) => {
  return (
    <OtherWrapper>
      <h2>Some older stuff:</h2>
      {items.map((item, index) => (
        <h4 key={index}>
          <a href={item.data.href} target="_blank" rel="noreferrer">
            {item.data.name}
          </a>
        </h4>
      ))}
    </OtherWrapper>
  );
};

export default Others;
