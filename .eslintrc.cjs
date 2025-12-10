module.exports = {
  extends: ["react-app", "react-app/jest", "plugin:prettier/recommended"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        printWidth: 120,
        singleQuote: false,
        semi: true,
        trailingComma: "all",
        endOfLine: "auto",
        tabWidth: 2,
        useTabs: false,
      },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "warn",
  },
};
