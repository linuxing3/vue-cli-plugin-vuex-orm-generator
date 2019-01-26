const fs = require("fs-extra");

const debug = require("debug")("vuex-orm:generator");

module.exports = (api, options, rootOptions) => {
  const templatesRoot = "./templates";

  const lang = api.hasPlugin("typescript") ? "ts" : "js";

  try {
    // 确认使用typescript
    if (!lang === "ts") {
      console.log("This plugin should be used with typescript");
      console.log("Please install it: vue add typescript ");
    }
    // 确认使用electron
    const usesELECTRON = api.hasPlugin("electron-builder");
    if (!usesELECTRON) {
      console.log("This plugin should be used with electron");
      console.log("Please install it: vue add electron-builder ");
    }
    // 安装依赖包
    const pkg = {
      dependencies: {
        lodash: "*",
        "lodash-id": "^0.14.0",
        "fs-extra": "^7.0.1",
        hygen: "1.6.x",
        nedb: "^1.8.0",
        "nedb-promise": "^2.0.1",
        lowdb: "^1.0.0",
        "vue-router": "^3.0.1",
        vuex: "^3.0.1",
        "@vuex-orm/core": "^0.29.0",
        "vuex-pathify": "^1.1.3",
      },
      devDependencies: {
        "@types/lowdb": "^1.0.6",
        "@types/nedb": "^1.8.6",
        "@types/webpack": "^4.4.17",
      },
    };

    debug("pkg", pkg);
    api.extendPackage(pkg);

    const scripts = {
      scripts: {
        new: "hygen new",
      },
    };

    debug("scripts", pkg);
    api.extendPackage(scripts);

    /**
     * 拷贝模板
     */
    console.log("文件准备完毕，拷贝到相应目录！");
    api.render(templatesRoot);
    console.log("文件拷贝完毕，进行后续处理！");
  } catch (e) {
    api.exitLog(`unexpected error: ${e.message}`, "error");
    return;
  }

  api.onCreateComplete(() => {
    debug("onCreateComplete called");
    console.log("示例模板准备完毕，拷贝到相应目录！");
    let sourceTemplatePath = api.resolve(
      "./node_modules/vue-cli-plugin-vuex-orm-generator/_templates",
    );
    let targetTemplatePath = api.resolve("./_templates");
    fs.copySync(sourceTemplatePath, targetTemplatePath);
    console.log("示例模板拷贝完毕！");
    console.log("安装插件完成！");
    console.log("使用说明");
    console.log("yarn new model");
    console.log("yarn new module");
    console.log("yarn new router");
    console.log("yarn new component-table");
    console.log("yarn new component-form");
  });
};
