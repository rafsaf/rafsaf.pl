import styled, { css } from "styled-components";
import { setColor } from "../../styles";
import { Link } from "gatsby";

const ButtonStyle = css<{ big?: boolean }>`
  display: inline-block;
  text-transform: uppercase;
  background: white;
  color: ${setColor.mainWhite};
  font-size: 1.5rem;
  max-width: 340px;
  margin: 1rem 0;
  padding: ${(props) => (props.big ? "1rem 1rem" : "0.4rem 0.7rem")};
  letter-spacing: 0.25rem;
  display: inline-block;
  font-weight: 500;
  transition: 0.3s linear;
  border: 3px solid ${setColor.mainWhite};
  cursor: pointer;
  background: transparent;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

  &:hover {
    background: ${setColor.mainWhite};
    color: ${setColor.mainBlack};
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.8);
  }
`;

export const Button = styled.button`
  ${ButtonStyle}
`;

export const ButtonLink = styled(Link)`
  ${ButtonStyle}
`;
