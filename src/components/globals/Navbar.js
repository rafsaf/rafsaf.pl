import React, { useState } from "react";
import styled from "styled-components";
import { setColor, setFont } from "../../styles";
import { FaGithub } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { BsX } from "react-icons/bs";
import { BiDownArrow } from "react-icons/bi";
import { StaticImage } from "gatsby-plugin-image";
import { Link } from "gatsby";

const Links = () => {
  return (
    <ul>
      <li>
        <NavLink to="/" activeClassName="active">
          <BiDownArrow />
          Home Page
        </NavLink>
      </li>
      <li>
        <NavLink to="/projects" activeClassName="active">
          <BiDownArrow />
          Projects
        </NavLink>
      </li>
    </ul>
  );
};

const Icons = [
  {
    icon: <FaGithub />,
    url: "https://github.com/rafsaf",
  },
];

const NavLink = styled(Link)`
  color: ${setColor.mainWhite};
  svg {
    display: none;
  }
  &:hover {
    color: ${setColor.primaryColor};
  }
  &.active {
    color: ${setColor.primaryColor};
    @media (max-width: 992px) {
      svg {
        display: inline;
        font-size: 1.8rem;
        margin-right: 0.5rem;
      }
    }
  }
`;

const Nav = styled.nav`
  position: fixed;
  z-index: 200;
  background: ${setColor.mainBlack};
  color: ${setColor.mainWhite};
  width: 100%;
  padding: 0.3rem 1.5rem;
  border-bottom: 1px solid ${setColor.primaryColor3};
  /* box-shadow: 0 1px 2px ; */
  @media (min-width: 992px) {
    padding: 0 1.5rem;
  }
`;

const NavCenter = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  @media (min-width: 992px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
  }
`;

const NavLogo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    cursor: pointer;
  }
  button svg {
    font-size: 2.7rem;
    color: ${(props) => (props.redToggle ? setColor.orange : setColor.light)};
  }
  @media (min-width: 992px) {
    button {
      display: none;
    }
  }
`;

const NavPhoneLinks = styled.div`
  ul {
    padding: 1rem 0rem;
  }
  ul li {
    font-size: 1.5rem;
    border-bottom: 1px solid ${setColor.light};
    padding-bottom: 0.7rem;
    margin: 1.2rem 1.3rem;
    text-transform: uppercase;
    ${setFont.roboto};
    letter-spacing: 0.15rem;
    font-weight: 500;
  }
  @media (min-width: 992px) {
    display: none;
  }
`;

const NavDesktopLinks = styled.div`
  display: none;
  ul {
    display: flex;
  }
  ul li {
    padding: 0 1.5rem;
    font-size: 1.2rem;
    text-transform: uppercase;
    ${setFont.roboto};
    letter-spacing: 0.15rem;
    font-weight: 300;
  }
  @media (min-width: 992px) {
    display: block;
  }
`;

const NavDesktopIcons = styled.div`
  display: none;
  @media (min-width: 992px) {
    display: block;
    a svg {
      color: ${setColor.mainWhite};
      font-size: 1.8rem;
    }
  }
`;

const Navbar = () => {
  const [toggle, setToggle] = useState(false);
  return (
    <Nav>
      <NavCenter>
        <NavLogo redToggle={toggle}>
          <Link to="/">
            <StaticImage
              src="../../images/rafsaf4.svg"
              placeholder="tracedSVG"
              height={45}
              alt="logo"
            />
          </Link>

          <button onClick={() => setToggle(!toggle)}>
            {toggle === false ? <GiHamburgerMenu /> : <BsX />}
          </button>
        </NavLogo>
        <NavPhoneLinks>{toggle ? <Links /> : null}</NavPhoneLinks>

        <NavDesktopLinks>
          <Links></Links>
        </NavDesktopLinks>
        <NavDesktopIcons>
          {Icons.map((item, index) => (
            <a key={index} href={item.url} target="_blank" rel="noreferrer">
              {item.icon}
            </a>
          ))}
        </NavDesktopIcons>
      </NavCenter>
    </Nav>
  );
};

export default Navbar;
