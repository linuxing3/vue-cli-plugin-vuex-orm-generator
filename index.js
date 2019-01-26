const { chainWebpack, getExternals } = require("./lib/webpackConfig");

module.exports = (api, options) => {
  // 根据vue.config.js中的vuexModuleGenerator设置更新webpack
  const pluginOptions =
    options.pluginOptions && options.pluginOptions.vuexModuleGenerator
      ? options.pluginOptions.vuexModuleGenerator
      : {};

  // 应用自定义的webpack配置
  api.chainWebpack(async config => {
    chainWebpack(api, pluginOptions, config);
  });
};
