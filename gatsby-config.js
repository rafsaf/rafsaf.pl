module.exports = {
  siteMetadata: {
    title: "gatsby-styled-components",
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
        repositoryName: "rafsaf-portfolio",
        accessToken:
          "MC5ZRm9jY3hJQUFDRUFHV3NO.T1zvv70MKe-_ve-_ve-_ve-_vU4HLxTvv73vv70777-977-9NwTvv71Dc0UhEu-_vXjvv70577-977-9",
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
