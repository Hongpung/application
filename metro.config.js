const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  
  const config = getDefaultConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer"),
    // Fast Refresh 비활성화 설정 추가
    enableBabelRCLookup: false,
  };

  config.resolver = {
    ...resolver,
    assetExts: resolver.assetExts.filter(ext => ext !== "svg"),
    sourceExts: [...resolver.sourceExts, "svg"],
  };

  return config;
})();
