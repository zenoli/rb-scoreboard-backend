module.exports = {
  parser: "@typescript-eslint/parser",
  extends: ["plugin:prettier/recommended", "prettier", "eslint:recommended"],
  plugins: ["@typescript-eslint"],
  rules: {
    "no-unused-vars": "info",
  },
  env: {
    node: true,
  },
}
