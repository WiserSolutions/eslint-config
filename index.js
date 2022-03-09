module.exports = {
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    ecmaVersion: 8,
    requireConfigFile: false,
    sourceType: "module",
  },
  parser: "@babel/eslint-parser",
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "arrow-body-style": ["error", "as-needed"],
    "no-shadow": "error", // shadowing is an easy way to let babel/webpack make mistakes
    "prefer-const": "error",
    semi: ["error", "never"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always", // Prettier
        named: "never",
        asyncArrow: "always", // Prettier
      },
    ],
    "require-atomic-updates": "off", // too many false positives as of yet
  },
};
