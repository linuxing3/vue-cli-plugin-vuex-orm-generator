/**
 * models is object to hold
 * {
 *   "user" : [user: UserModule extends VuexModel]
 * }
 */
import { toLower } from "lodash";

let requiredModule: RequireContext = require.context(".", false, /\.ts$/);
let modules = {};

requiredModule.keys().forEach(key => {
  if (key === "./index.ts") return;
  let moduleName = toLower(key.replace(/(\.\/|\.ts)/g, ""));
  modules[moduleName] = requiredModule(key).default;
});

export default modules;
