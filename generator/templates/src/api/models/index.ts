import { toLower } from "lodash";

let requiredModels = require.context(".", false, /\.ts$/);
let models = {};

requiredModels.keys().forEach(key => {
  if (key === "./index.ts") return;
  let moduleName = toLower(key.replace(/(\.\/|\.ts)/g, ""));
  models[moduleName] = requiredModels(key).default;
});

export default models;
