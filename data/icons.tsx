import {
  FaPython,
  FaAws,
  FaReact,
  FaCss3,
  FaHtml5,
  FaLinux,
  FaGithub,
  FaDocker,
} from "react-icons/fa";
import { AiOutlineMinus, AiOutlineConsoleSql } from "react-icons/ai";
import {
  DiGit,
  DiDjango,
  DiJavascript1,
  DiPostgresql,
  DiVisualstudio,
} from "react-icons/di";
import {
  SiDjango,
  SiPypi,
  SiTypescript,
  SiKubernetes,
  SiGrafana,
  SiPrometheus,
  SiJira,
  SiAnsible,
} from "react-icons/si";
import styled from "styled-components";
import React from "react";
import { setColor } from "../styles";
import { BiCloud, BiLogoGoLang } from "react-icons/bi";

const returnIcon = (iconName: string): JSX.Element => {
  if (iconName in icons) {
    return icons[iconName];
  }
  return icons["notFound"];
};

export default returnIcon;

interface IconsI {
  [key: string]: JSX.Element;
}

const Icon = styled.span<{ $large?: boolean; $small?: boolean }>`
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translate(-50%);
  font-size: ${(props) => (props.$large ? "2.8rem" : "2.3rem")};
  ${(props) => (props.$small ? "font-size:1.7rem" : "")};
  color: ${setColor.mainWhite};
`;

const icons: IconsI = {
  notFound: (
    <Icon>
      <AiOutlineMinus />
    </Icon>
  ),
  typescript: (
    <Icon $small>
      <SiTypescript />
    </Icon>
  ),
  docker: (
    <Icon>
      <FaDocker />
    </Icon>
  ),
  pypi: (
    <Icon>
      <SiPypi />
    </Icon>
  ),
  iaac: (
    <Icon>
      <SiAnsible />
    </Icon>
  ),
  cloud_providers: (
    <Icon>
      <BiCloud />
    </Icon>
  ),
  prometheus: (
    <Icon $small>
      <SiPrometheus />
    </Icon>
  ),
  jira: (
    <Icon $small>
      <SiJira />
    </Icon>
  ),
  go: (
    <Icon $large>
      <BiLogoGoLang />
    </Icon>
  ),
  python: (
    <Icon>
      <FaPython />
    </Icon>
  ),
  git: (
    <Icon>
      <DiGit />
    </Icon>
  ),
  github: (
    <Icon>
      <FaGithub />
    </Icon>
  ),
  vscode: (
    <Icon>
      <DiVisualstudio />
    </Icon>
  ),
  postgres: (
    <Icon>
      <DiPostgresql />
    </Icon>
  ),
  sql: (
    <Icon>
      <AiOutlineConsoleSql />
    </Icon>
  ),
  html: (
    <Icon>
      <FaHtml5 />
    </Icon>
  ),
  linux: (
    <Icon>
      <FaLinux />
    </Icon>
  ),
  css: (
    <Icon>
      <FaCss3 />
    </Icon>
  ),
  django: (
    <Icon $large>
      <DiDjango />
    </Icon>
  ),
  djangoRest: (
    <Icon $small>
      <SiDjango />
    </Icon>
  ),
  aws: (
    <Icon>
      <FaAws />
    </Icon>
  ),
  grafana: (
    <Icon $small>
      <SiGrafana />
    </Icon>
  ),
  js: (
    <Icon>
      <DiJavascript1 />
    </Icon>
  ),
  react: (
    <Icon>
      <FaReact />
    </Icon>
  ),
  kubernetes: (
    <Icon>
      <SiKubernetes />
    </Icon>
  ),
};
