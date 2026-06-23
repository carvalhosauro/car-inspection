import config from "@vistoria/config/eslint";

export default [
  ...config,
  { ignores: ["dist", "node_modules"] }
];
