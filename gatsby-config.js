module.exports = {
  siteMetadata: {
    title: "gatsby-rafsaf-portfolio",
    siteUrl: "https://rafsaf.pl/",
  },
  plugins: [
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-sitemap",
    `gatsby-plugin-smoothscroll`,
    {
      resolve: `gatsby-plugin-webfonts`,
      options: {
        fonts: {
          google: [
            {
              family: "Roboto Mono",
              variants: ["200", "300"],
            },
            {
              family: "Lato",
            },
            {
              family: "Courgette",
            },
          ],
        },
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "src/images/ico.png",
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-prismic",
      options: {
        repositoryName: `${process.env.GATSBY_PORTFOLIO_REPOSITORY_NAME}`,
        accessToken: `${process.env.GATSBY_PORTFOLIO_ACCESS_TOKEN}`,
        linkResolver: ({ node, key, value }) => (doc) => {
          return "/";
        },
        schemas: {
          Skill: require("./custom_types/Skill.json"),
          Time_period: require("./custom_types/Time_period.json"),
          Article: require("./custom_types/Article.json"),
          OldArticle: require("./custom_types/OldArticle.json"),
        },
      },
    },
  ],
};
