module.exports = {
  bumpFiles: [
    {
      filename: "app.json",
      updater: require('./expo-updater'),
    },
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "package-lock.json",
      type: "json",
    },
  ],
};
