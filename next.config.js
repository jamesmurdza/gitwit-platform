// @ts-check
const { withBlitz } = require("@blitzjs/next")

/**
 * @type {import('@blitzjs/next').BlitzConfig}
 **/
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/u/**",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Add the node-loader rule to handle .node files
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    })

    return config
  },
}

module.exports = withBlitz(config)
