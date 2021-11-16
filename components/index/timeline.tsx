import React, { useEffect, useState } from "react";
import JSONData from "../../data/TimePeriods.json";
import styled from "styled-components";
import { setColor } from "../../styles";
import ReactMarkdown from "react-markdown";

interface YearInfo {
  data: {
    path: string;
  };
}

interface MdItem {
  content: string;
}

const ComponentName = () => {
  const data: YearInfo[] = JSONData;
  const [mdItems, setMdItems] = useState<MdItem[]>([]);

  useEffect(() => {
    const getMarkdownTextByPath = async (path: string) => {
      return fetch(path)
        .then((res) => res.text())
        .then((codeText) => {
          return codeText;
        });
    };
    const fillMdItems = async () => {
      const newMdItems: MdItem[] = [];
      for (const value of data) {
        const text = await getMarkdownTextByPath(value.data.path);
        newMdItems.push({ content: text });
      }
      console.log("dupa123");
      console.log(newMdItems);
      setMdItems(newMdItems);
    };
    fillMdItems();
  }, []);

  return (
    <TimeLineWrapper>
      <Container>
        {mdItems.map((node, index) => (
          <SingleTimePeriod key={index}>
            <div>
              <ReactMarkdown>{node.content}</ReactMarkdown>
            </div>
          </SingleTimePeriod>
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
  font-size: 1.3rem;
  width: 90vw;
  margin: 5rem auto;
  @media (min-width: 768px) {
    width: 60vw;
  }
`;

const SingleTimePeriod = styled.article`
  margin-bottom: 4rem;
`;
