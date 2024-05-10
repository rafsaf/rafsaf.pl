const withExportImages = require("next-export-optimize-images");

/** @type {import('next').NextConfig} */
module.exports = withExportImages({
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  output: 'export',
});