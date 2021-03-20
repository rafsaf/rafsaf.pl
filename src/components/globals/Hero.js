import React from "react"
import styled from "styled-components"
import { StaticImage } from "gatsby-plugin-image"

const HeroContainer = styled.header`
  position: relative;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Hero = ({ children }) => {
  return (
    <HeroContainer>
      <StaticImage
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          zIndex: -1,
        }}
        src="../../images/icon.png"
        alt="xx"
        placeholder="blurred"
        layout="fullWidth"
      />
      {children}
    </HeroContainer>
  )
}

export default Hero
