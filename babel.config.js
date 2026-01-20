module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], // O 'module:metro-react-native-babel-preset' si es CLI
    plugins: [
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@styles": "./presentation/styles/index",
            "@": "./",
          },
        },
      ],
    ],
  };
};
