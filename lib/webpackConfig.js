const fs = require("fs");

async function chainWebpack(api, pluginOptions, config) {
  // Electron渲染进程设置器
  const rendererProcessChain =
    pluginOptions.chainWebpackRendererProcess || (config => config);

  if (process.env.IS_ELECTRON) {
    // 添加外部依赖
    config.externals(getExternals(api, pluginOptions));
    // 修改Webpack配置，用于Electron
    /**
     * 设置打包目标文件为electron渲染进程文件
     */
    config
      .target("electron-renderer")
      .node.set("__dirname", false)
      .set("__filename", false);
    /**
     * 定义Electron环境下的变量
     */
    if (process.env.NODE_ENV === "production") {
      //  设置process.env.BASE_URL和__static为绝对文件路径__dirname
      config.plugin("define").tap(args => {
        args[0]["process.env"].BASE_URL = "__dirname";
        args[0].__static = "__dirname";
        return args;
      });
      // 不添加node_modules目录
      process.env.VUE_APP_NODE_MODULES_PATH = false;
    } else if (process.env.NODE_ENV === "development") {
      // 将node_modules目录设置为外部模块查找路径
      process.env.VUE_APP_NODE_MODULES_PATH = api
        .resolve("./node_modules")
        .replace(/\\/g, "/");
      //   将__static指向public目录，用于渲染所有静态文件
      config.plugin("define").tap(args => {
        args[0].__static = JSON.stringify(api.resolve("./public"));
        return args;
      });
    }
    // 应用用户配置
    rendererProcessChain(config);
  } else {
    // 不添加node_modules路径
    process.env.VUE_APP_NODE_MODULES_PATH = false;
  }
}

/**
 * 查找所有符合以下条件的依赖库并加为外部库
 * 1、没有main属性
 * 2、包括Binary属性
 * 3、用户设置属性
 */
function getExternals(api, pluginOptions) {
  const nodeModulesPath = pluginOptions.nodeModulesPath || "./node_modules";
  let nodeModulesPaths = [];
  if (Array.isArray(nodeModulesPath)) {
    // 如果是数组
    nodeModulesPaths = nodeModulesPath;
  } else {
    // 如果是字符串
    nodeModulesPaths.push(nodeModulesPath);
  }
  const userExternals = pluginOptions.externals || [];
  const userExternalsWhitelist = [];
  userExternals.forEach((d, i) => {
    if (d.match(/^!.*$/)) {
      userExternals.splice(i, 1);
      userExternalsWhitelist.push(d.replace(/^!/, ""));
    }
  });
  // 获取package.json文件的dependencies属性
  const { dependencies } = require(api.resolve("./package.json"));
  const externalsList = Object.keys(dependencies || {}).filter(dep => {
    // 对需要加为外部库的返回真
    try {
      let pgkString;
      for (const path of nodeModulesPaths) {
        // 如果该库有package.json文件
        if (fs.existsSync(api.resolve(`${path}/${dep}/package.json`))) {
          // If it does, read it and break
          pgkString = fs
            .readFileSync(api.resolve(`${path}/${dep}/package.json`))
            .toString();
          break;
        }
      }
      if (!pgkString) {
        throw new Error(`Could not find a package.json for module ${dep}`);
      }
      // 获取该库的package.json
      const pkg = JSON.parse(pgkString);
      const fields = ["main", "module", "jsnext:main", "browser"];
      return (
        // 如果既不在白名单中，有符合下面一种条件的
        userExternalsWhitelist.indexOf(dep) === -1 &&
        // 也没main属性
        (!fields.some(field => field in pkg) ||
          // 但有binary属性
          !!pkg.binary ||
          // 有gypfile属性
          !!pkg.gypfile ||
          // Listed in user-defined externals list
          userExternals.indexOf(pkg.name) > -1)
      );
    } catch (e) {
      console.log(e);
      return true;
    }
  });
  let externals = {};
  externalsList.forEach(d => {
    // 在运行时中将，外部库直接导入
    externals[d] = `require("${d}")`;
  });
  return externals;
}
module.exports = { getExternals, chainWebpack };
