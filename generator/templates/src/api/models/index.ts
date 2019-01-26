/**
 * 动态路由
 */
let models =  [];

let requireModels = require.context(".", false, /\.ts$/);

requireModels.keys().forEach(key => {
  if (key === "./index.ts") return;
  models.push(requireModels[key].default || requireModels[key]);
})

export default models;
