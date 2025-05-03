module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env", // 환경 변수를 불러오는 경로 설정
          path: ".env", // .env 파일 경로
          blocklist: null,
          allowlist: null,
          blacklist: null, // 이전 버전 호환
          whitelist: null, // 이전 버전 호환
          safe: false,
          allowUndefined: true,
          verbose: false,
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
