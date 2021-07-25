import React, { useState } from "react";
import styled from "styled-components";
import { setColor, setFont } from "../../styles";
import returnIcon from "../../data/icons";
import { CodeBlock, tomorrowNight } from "react-code-blocks";
import { useStaticQuery, graphql } from "gatsby";

const query = graphql`
  {
    allPrismicSkill(sort: { fields: data___area, order: ASC }) {
      nodes {
        data {
          code
          area
          icon
          language
          title
        }
      }
    }
  }
`;

interface CodeBlockData {
  data: {
    code: string;
    area: string;
    icon: string;
    language: string;
    title: string;
  };
}

interface Data {
  allPrismicSkill: {
    nodes: CodeBlockData[];
  };
}

const Skills = () => {
  const [area, setArea] = useState("b");
  const [language, setLanguage] = useState("python");
  const data: Data = useStaticQuery(query);
  const [text, setText] = useState<string>(
    data.allPrismicSkill.nodes[0].data.code
  );

  return (
    <>
      <GridArea id="skills">
        <TechArea>
          <CodeWrapper>
            <p>Technologies</p>
            <MyCodeBlock code={text} language={language} />
          </CodeWrapper>
        </TechArea>
        {data.allPrismicSkill.nodes.map((item, index) => (
          <AreaButton
            key={index}
            area={item.data.area}
            clicked={area === item.data.area}
            onClick={() => {
              setLanguage(item.data.language);
              setArea(item.data.area);
              setText(item.data.code);
            }}
          >
            <p>{item.data.title}</p> {returnIcon(`${item.data.icon}`)}
          </AreaButton>
        ))}
      </GridArea>
    </>
  );
};

export default Skills;

const MyCodeBlock: React.FC<{
  code: string;
  language: string;
  showLineNumbers?: boolean;
}> = ({ code, language, showLineNumbers }) => {
  return (
    <CodeBlock
      text={code}
      language={language}
      showLineNumbers={showLineNumbers}
      theme={tomorrowNight}
      wrapLines
    />
  );
};

const GridArea = styled.div`
  width: 100%;
  min-height: 110vh;
  border-bottom: 1rem solid ${setColor.mainGrey};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(10, 1fr);
  grid-template-areas:
    "b c"
    "d e"
    "h i"
    "j k"
    "n o"
    "p q"
    "t u"
    "v w"
    "m x"
    "y z";

  @media (min-width: 768px) {
    grid-template-columns: 3fr 2fr;
    grid-template-rows: repeat(20, 1fr);
    grid-template-areas:
      "a b"
      "a c"
      "a d"
      "a e"
      "a h"
      "a i"
      "a j"
      "a k"
      "a n"
      "a o"
      "a p"
      "a q"
      "a t"
      "a u"
      "a v"
      "a w"
      "a m"
      "a x"
      "a y"
      "a z";
  }

  @media (min-width: 992px) {
    grid-template-columns: 5fr 2fr 2fr;
    grid-template-rows: repeat(10, 1fr);
    grid-template-areas:
      "a b c"
      "a d e"
      "a h i"
      "a j k"
      "a n o"
      "a p q"
      "a t u"
      "a v w"
      "a m x"
      "a y z";
  }
  @media (min-width: 1178px) {
    grid-template-columns: 5fr 2fr 2fr 2fr;
    grid-template-rows: repeat(7, 1fr);
    grid-template-areas:
      "a b c d"
      "a h i j"
      "a n o p"
      "a t u v"
      "a m x y"
      "a e k q"
      "a w z q";
  }
  @media (min-width: 1368px) {
    grid-template-columns: 6fr 3fr 2fr 2fr 2fr;
    grid-template-rows: repeat(5, 1fr);
    grid-template-areas:
      "a b c d e"
      "a h i j k"
      "a n o p q"
      "a t u v w"
      "a m x y z";
  }
`;

const AreaButton = styled.button<{ area: string; clicked?: boolean }>`
  min-height: 10rem;
  position: relative;
  grid-area: ${(props) => props.area};
  background: ${setColor.primaryColor3};
  color: ${setColor.mainWhite};
  border-bottom: 1px solid ${setColor.mainGrey};
  border-left: 1px solid ${setColor.mainGrey};
  font-size: 1.3rem;
  padding: 0 1rem;
  font-weight: 400;
  letter-spacing: 0.25rem;
  text-transform: uppercase;
  ${setFont.roboto}

  @media (min-width: 768px) {
    background: ${(props) =>
      props.clicked ? setColor.primaryColor2 : setColor.primaryColor3};
    cursor: pointer;
    span svg {
      ${(props) => (props.clicked ? "transform: scale(1.35);" : "")}
    }
    &:hover {
      background: ${setColor.primaryColor2};
      transition: 0.4s linear;

      span svg {
        ${(props) =>
          !props.clicked
            ? "transform: scale(1.35);transition: 0.3s linear;"
            : ""}
      }
    }
  }
`;
const TechArea = styled.div`
  background: ${setColor.primaryColor2};
  color: ${setColor.mainWhite};
  position: relative;
  display: none;

  @media (min-width: 768px) {
    display: block;
    grid-area: a;
  }
`;

const CodeWrapper = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0.5rem;
  margin: 1rem;
  font-size: 1.1rem;
  text-align: left;

  p {
    ${setFont.roboto}
    text-align: center;
    text-transform: uppercase;
    padding-top: 4.5rem;
    font-size: 2.5rem;
    font-weight: 400;
    letter-spacing: 0.2rem;
  }

  @media (min-width: 992px) {
    font-size: 1.3rem;
  }
  @media (min-width: 1178px) {
    margin-bottom: 5rem;
    font-size: 1.4rem;
    p {
      padding-top: 4rem;
    }
  }
  @media (min-width: 1368px) {
    margin-bottom: 8rem;
    font-size: 1.5rem;
  }
`;
