import config from "@vistoria/config/eslint";

export default [
  ...config,
  { ignores: ["dist", "storybook-static", "node_modules"] }
];
