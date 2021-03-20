import React from "react"
import Layout from "../components/layout"
import { Helmet } from "react-helmet"
import Hero from "../components/globals/Hero"

const index = () => {
  return (
    <Layout>
      <Helmet>
        <title>Project title</title>
        <meta name="description" content="Project made with Gatsby.js" />
      </Helmet>
      <Hero src="../images/tour-1.jpeg">
        <h1>hello world</h1>
      </Hero>
    </Layout>
  )
}

export default index
