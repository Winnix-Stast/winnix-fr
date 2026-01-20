const expoConfig = require("eslint-config-expo/flat");

module.exports = [
  ...expoConfig,
  {
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },
    rules: {},
    ignores: ["dist/*"],
  },
];
