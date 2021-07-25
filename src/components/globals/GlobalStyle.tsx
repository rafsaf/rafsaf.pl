import { createGlobalStyle } from "styled-components"
import { setColor, setFont } from "../../styles"

export const Global = createGlobalStyle`

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    
}
body {
    ${setFont.main};
    background: ${setColor.mainWhite};
    color: ${setColor.primaryColor};
    line-height: 1.5;
    font-size: 0.875rem;
}
a {
    text-decoration: none;
}
button {
    background: transparent;
    border: none;
    outline: none;
    font-weight: 400;
}
img {
    width: 100%;
    display: block;
}

h1,
h2,
h3,
h4 {
    letter-spacing: 0.25rem;
    text-transform: capitalize;
    line-height: 1.25;
    margin-bottom: 0.75rem;
}

h1 {
    font-size: 3rem;
}
h2 {
    font-size: 2rem;
}
h3 {
    font-size: 1.5rem;
}
h4 {
    font-size: 0.875rem;
}
p {
    margin-bottom: 1.25rem;
}
ul {
    list-style: none;
}
@media (min-width: 800px) {
  h1 {
    font-size: 4rem;
  }
  h2 {
    font-size: 2.5rem;
  }
  h3 {
    font-size: 2rem;
  }
  h4 {
    font-size: 1rem;
  }
  body {
    font-size: 1rem;
  }
  h1,
  h2,
  h3,
  h4 {
    line-height: 1;
  }
}
`
