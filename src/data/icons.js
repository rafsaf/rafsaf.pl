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
import { AiOutlineConsoleSql } from "react-icons/ai";
import {
  DiGit,
  DiDjango,
  DiJavascript1,
  DiPostgresql,
  DiVisualstudio,
} from "react-icons/di";
import {
  SiDjango,
  SiGatsby,
  SiApache,
  SiPypi,
  SiTypescript,
} from "react-icons/si";
import styled from "styled-components";
import React from "react";
import { setColor } from "../styles";

const Icon = styled.span`
  position: absolute;
  bottom: 5px;
  left: 50%;
  transform: translate(-50%);
  font-size: ${(props) => (props.large ? "2.8rem" : "2.3rem")};
  ${(props) => (props.small ? "font-size:1.7rem" : "")};
  color: ${setColor.mainWhite};
`;

const icons = {
  typescript: (
    <Icon>
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
    <Icon large>
      <DiDjango />
    </Icon>
  ),
  djangoRest: (
    <Icon small>
      <SiDjango />
    </Icon>
  ),
  aws: (
    <Icon>
      <FaAws />
    </Icon>
  ),
  gatsby: (
    <Icon small>
      <SiGatsby />
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
  apache: (
    <Icon>
      <SiApache />
    </Icon>
  ),
};

export default icons;
