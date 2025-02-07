const securityHeaders = [
  {
    key: "X-Frame-Options",
    value: "deny",
  },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Content-Type-Options", value: "nosniff" },
];

module.exports = {
  async headers() {
    return [
      {
        headers: securityHeaders,
        // Apply these headers to all routes in your application.
        source: "/:path*",
      },
    ];
  },
  poweredByHeader: false,
  webpack: (config, { isServer, dev }) => {
    config.module.rules.push({
      exclude: /node_modules/,
      loader: "graphql-tag/loader",
      test: /\.(graphql|gql)$/,
    });
    config.module.rules.push({
      test: /\.woff2$/,
      type: "asset/resource",
    });
    config.resolve = {
      ...config.resolve,
      fallback: {
        fs: false,
      },
    };
    return config;
  },
  transpilePackages: [
    "@shared/utils",
    "@socialgouv/cdtn-ui",
    "@codegouvfr/react-dsfr",
    "tss-react",
  ],
};
