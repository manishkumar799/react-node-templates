export default {
  env: { node: true, es2022: true, jest: true },
  extends: ["airbnb-base"],
  rules: {
    "no-console": "off",
    "import/extensions": ["error", "ignorePackages", { js: "always" }],
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
  },
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
};
