import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import styled, { css } from "styled-components";
import { setColor } from "../../styles";
import { HiOutlineArrowCircleUp } from "react-icons/hi";

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
    border: 4px dashed ${setColor.primaryColor3};
    border-right: 4px transparent;
    border-top: 4px transparent;
  }
  svg {
    position: absolute;
    left: -2px;
    bottom: 50%;
    transform: translate(-50%, 50%);
    font-size: 1rem;
    color: ${setColor.mainWhite};
    background: ${setColor.primaryColor3};
    border-radius: 50%;
  }
  h2 {
    border-left: 4px dashed ${setColor.primaryColor3};
    border-top: 4px dashed ${setColor.primaryColor3};
  }
`;

const rightDashed = css`
  p {
    border: 4px transparent;
    border-right: 4px dashed ${setColor.primaryColor3};
  }
  svg {
    position: absolute;
    right: -2px;
    bottom: 50%;
    transform: translate(50%, 50%);
    font-size: 1rem;
    color: ${setColor.mainWhite};
    background: ${setColor.primaryColor3};
    border-radius: 50%;
  }
  h2 {
    border-right: 4px dashed ${setColor.primaryColor3};
  }
`;

const GridCard = styled.div`
  p {
    position: relative;
    margin: 0;
    font-size: 1.2rem;
    padding: 1rem;
  }
  h2 {
    padding: 2rem 1rem 1rem;
    margin-bottom: 3px;
    text-align: center;
  }
  ${(props) => (props.left ? leftDashed : rightDashed)}
  @media (min-width: 768px) {
    p {
      padding: 3rem;
      font-size: 1.3rem;
    }
    svg {
      font-size: 2rem;
    }
  }
`;

const ComponentName = () => {
  const data = useStaticQuery(graphql`
    {
      items: allPrismicTimePeriod(sort: { fields: data___year, order: DESC }) {
        nodes {
          data {
            text
            year
          }
        }
      }
    }
  `);
  return (
    <TimeLineWrapper>
      <Container>
        {data.items.nodes.map((node, index) => (
          <GridCard left={index % 2 === 0} key={index}>
            <div>
              <h2>{node.data.year}</h2>
            </div>
            <div>
              <p>
                {node.data.text}
                <HiOutlineArrowCircleUp />
              </p>
            </div>
          </GridCard>
        ))}
      </Container>
    </TimeLineWrapper>
  );
};

export default ComponentName;
