import config from "@vistoria/config/eslint";

export default [
  ...config,
  { ignores: ["dist", "coverage", "node_modules"] }
];
