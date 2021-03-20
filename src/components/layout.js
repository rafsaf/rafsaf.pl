import React from "react"
import { Global } from "./globals/GlobalStyle"
import { Helmet } from "react-helmet"

const layout = ({ children }) => {
  return (
    <main>
      <Helmet>
        <meta charSet="utf-8" />
        <link
          href="https://fonts.googleapis.com/css2?family=Courgette&family=Lato&display=swap"
          rel="stylesheet"
        />
      </Helmet>
      <Global />
      {children}
    </main>
  )
}

export default layout
