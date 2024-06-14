module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:prettier/recommended", "prettier", "eslint:recommended"],
  plugins: ["@typescript-eslint"],
  rules: {},
  env: {
    node: true,
  },
}
