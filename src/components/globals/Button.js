import styled from "styled-components"

const Button = styled.button`
  display: inline-block;
  text-transform: uppercase;
  background: white;
  color: rgba(34, 127, 136, 0.7);
  padding: ${(props) => (props.big ? "0.9rem 1.2rem" : "0.4rem 0.7rem")};
  letter-spacing: 0.25rem;
  display: inline-block;
  font-weight: 700;
  transition: 0.3s linear;
  border: 2px solid transparent;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  &:hover {
    color: white;
    background: transparent;
    border-color: white;
  }
`

export default Button
