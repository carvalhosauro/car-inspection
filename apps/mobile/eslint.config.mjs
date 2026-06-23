import config from "@vistoria/config/eslint";

export default [
  ...config,
  {
    files: ["**/*.config.js", "**/*.config.cjs", "jest.setup.ts"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  { ignores: ["dist", ".expo", "node_modules"] }
];
