const fs = require("fs");
const appJson = require("../../app.json");

delete appJson.expo.runtimeVersion;
delete appJson.expo.updates.url;

fs.writeFileSync("app.json", JSON.stringify(appJson, null, 2));
