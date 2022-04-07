const detectIndent = require("detect-indent");
const detectNewline = require("detect-newline");
const stringifyPackage = require("stringify-package");

module.exports.readVersion = function (contents) {
  return JSON.parse(contents).expo.version;
};

module.exports.writeVersion = function (contents, version) {
  const json = JSON.parse(contents);
  const indent = detectIndent(contents).indent;
  const newline = detectNewline(contents);
  json.expo.version = version;
  return stringifyPackage(json, indent, newline);
};
