import React from "react";
import JSONData from "../../data/TimePeriods.json";
import styled, { css } from "styled-components";
import { setColor } from "../../styles";
import { HiOutlineArrowCircleUp } from "react-icons/hi";

interface YearInfo {
  data: {
    text: string;
    year: number;
  };
}

const ComponentName = () => {
  const data: YearInfo[] = JSONData;
  return (
    <TimeLineWrapper>
      <Container>
        {data.map((node, index) => (
          <GridCard left={index % 2 === 0} key={index}>
            <div>
              <h2>{node.data.year}</h2>
            </div>
            <div>
              <p dangerouslySetInnerHTML={{ __html: node.data.text }}></p>
              <HiOutlineArrowCircleUp />
            </div>
          </GridCard>
        ))}
      </Container>
    </TimeLineWrapper>
  );
};

export default ComponentName;

const TimeLineWrapper = styled.article`
  min-height: 60vh;
  color: ${setColor.mainBlack};
  padding-bottom: 5rem;
`;

const Container = styled.div`
  width: 90vw;
  margin: 5rem auto;
  @media (min-width: 768px) {
    width: 60vw;
  }
`;

const leftDashed = css`
  p {
    border: 3px dashed ${setColor.primaryColor3};
    border-right: 3px transparent;
    border-top: 3px transparent;
  }
  svg {
    position: absolute;
    left: 2px;
    bottom: 50%;
    transform: translate(-50%, 50%);
    font-size: 1rem;
    color: ${setColor.mainWhite};
    background: ${setColor.primaryColor3};
    border-radius: 50%;
  }
  h2 {
    border-left: 3px dashed ${setColor.primaryColor3};
    border-top: 3px dashed ${setColor.primaryColor3};
  }
  @media (min-width: 768px) {
    p {
      border: 4px dashed ${setColor.primaryColor3};
      border-right: 4px transparent;
      border-top: 4px transparent;
    }
    h2 {
      border-left: 4px dashed ${setColor.primaryColor3};
      border-top: 4px dashed ${setColor.primaryColor3};
    }
  }
`;

const rightDashed = css`
  p {
    border: 3px transparent;
    border-right: 3px dashed ${setColor.primaryColor3};
  }
  svg {
    position: absolute;
    right: 2px;
    bottom: 50%;
    transform: translate(50%, 50%);
    font-size: 1rem;
    color: ${setColor.mainWhite};
    background: ${setColor.primaryColor3};
    border-radius: 50%;
  }
  h2 {
    border-right: 3px dashed ${setColor.primaryColor3};
  }
  @media (min-width: 768px) {
    p {
      border: 4px transparent;
      border-right: 4px dashed ${setColor.primaryColor3};
    }
    h2 {
      border-right: 4px dashed ${setColor.primaryColor3};
    }
  }
`;

const GridCard = styled.div<{ left?: boolean }>`
  position: relative;
  p {
    position: relative;
    margin: 0;
    font-size: 1.2rem;
    padding: 1rem;
    padding-bottom: 6rem;
  }
  h2 {
    padding: 2rem 1rem 1rem;
    margin-bottom: 3px;
    text-align: center;
  }
  svg {
    display: none;
  }
  ${(props) => (props.left ? leftDashed : rightDashed)}
  @media (min-width: 768px) {
    svg {
      display: block;
    }
    h2 {
      font-size: 3rem;
    }
    p {
      padding: 5rem;
      padding-bottom: 11rem;
      padding-top: 3rem;
      font-size: 1.6rem;
    }
    svg {
      font-size: 2rem;
    }
  }
  @media (max-width: 767px) {
    p,
    h2 {
      border-left: 3px transparent;
      border-right: 3px transparent;
    }
  }
`;
