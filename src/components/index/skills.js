import React, { useState } from "react"
import styled from "styled-components"
import { setColor, setFont } from "../../styles"
import areas from "../../data/areas"
import { CodeBlock, tomorrowNight } from "react-code-blocks"

function MyCodeBlock({ code, language, showLineNumbers }) {
  return (
    <CodeBlock
      text={code}
      language={language}
      showLineNumbers={showLineNumbers}
      theme={tomorrowNight}
      wrapLines
    />
  )
}

const GridArea = styled.div`
  width: 100%;
  min-height: 90vh;
  border-bottom: 1.25rem solid ${setColor.border};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(8, 1fr);
  grid-template-areas:
    "b c"
    "d e"
    "h i"
    "j k"
    "n o"
    "p q"
    "t u"
    "v w";

  @media (min-width: 768px) {
    grid-template-columns: 3fr 2fr;
    grid-template-rows: repeat(16, 1fr);
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
      "a w";
  }

  @media (min-width: 992px) {
    grid-template-columns: 5fr 2fr 2fr;
    grid-template-rows: repeat(8, 1fr);
    grid-template-areas:
      "a b c"
      "a d e"
      "a h i"
      "a j k"
      "a n o"
      "a p q"
      "a t u"
      "a v w";
  }
  @media (min-width: 1178px) {
    grid-template-columns: 5fr 2fr 2fr 2fr;
    grid-template-rows: repeat(6, 1fr);
    grid-template-areas:
      "a b c d"
      "a h i j"
      "a n o p"
      "a t u v"
      "a e k w"
      "a q k w";
  }
  @media (min-width: 1368px) {
    grid-template-columns: 6fr 3fr 2fr 2fr 2fr;
    grid-template-rows: repeat(4, 1fr);
    grid-template-areas:
      "a b c d e"
      "a h i j k"
      "a n o p q"
      "a t u v w";
  }
`

const AreaButton = styled.button`
  min-height: 10rem;
  position: relative;
  grid-area: ${(props) => props.area};
  background: ${setColor.darkerArea};
  color: ${setColor.mainWhite};
  border-bottom: 1px solid ${setColor.borderOrange};
  border-left: 1px solid ${setColor.borderOrange};
  font-size: 1.3rem;
  font-weight: 400;
  letter-spacing: 0.25rem;
  text-transform: uppercase;
  ${setFont.roboto}

  @media (min-width: 768px) {
    background: ${(props) =>
      props.clicked ? setColor.darkArea : setColor.darkerArea};
    cursor: pointer;
    span svg {
      ${(props) => (props.clicked ? "transform: scale(1.35);" : "")}
    }
    &:hover {
      background: ${setColor.darkArea};
      transition: 0.4s linear;

      span svg {
        ${(props) =>
          !props.clicked
            ? "transform: scale(1.35);transition: 0.3s linear;"
            : ""}
      }
    }
  }
`
const TechArea = styled.div`
  background: ${setColor.darkArea};
  color: ${setColor.mainWhite};
  position: relative;
  display: none;
  border-right: 1px solid ${setColor.borderOrange};

  @media (min-width: 768px) {
    display: block;
    grid-area: a;
  }
`

const AreaDescription = styled.article`
  height: 50vh;
`
const CodeWrapper = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0.5rem;
  margin: 1rem;
  font-size: 1.2rem;
  text-align: left;
  p {
    ${setFont.roboto}
    text-align: center;
    text-transform: uppercase;
    padding-top: 1.4rem;
    font-size: 2.5rem;
    font-weight: 400;
    letter-spacing: 0.2rem;
  }

  @media (min-width: 992px) {
    font-size: 1.4rem;
  }
  @media (min-width: 1178px) {
    font-size: 1.6rem;
    position: static;
  }
  @media (min-width: 1368px) {
    font-size: 1.8rem;
  }
`

const Skills = () => {
  const [area, setArea] = useState("b")
  const [language, setLanguage] = useState("python")
  const [text, setText] = useState(areas[0].text)

  return (
    <>
      <GridArea id="skills">
         <TechArea>
          <CodeWrapper>
            <p>Technologie</p>
            <MyCodeBlock code={text} language={language} />
          </CodeWrapper>
        </TechArea>
        {areas.map((item) => (
          <AreaButton
            large={item.large}
            area={item.area}
            clicked={area === item.area}
            onClick={() => {
              setArea(item.area)
              setText(item.text)
              setLanguage(item.language)
            }}
          >
            <p>{item.title}</p> {item.icon}
          </AreaButton>
        ))}
      </GridArea>
      <AreaDescription></AreaDescription>
    </>
  )
}

export default Skills
