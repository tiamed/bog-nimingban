// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

// eslint-disable-next-line no-undef
const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push("cjs");

module.exports = defaultConfig;
