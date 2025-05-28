const {
  getSentryExpoConfig
} = require("@sentry/react-native/metro");

module.exports = (() => {
  
  const config = getSentryExpoConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
    babelTransformerPath: require.resolve("react-native-svg-transformer/expo"),
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