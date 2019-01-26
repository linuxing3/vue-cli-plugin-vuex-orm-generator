# Vuex Orm module generator

## 基本描述

- [vue-cli 3](https://github.com/vuejs/vue-cli)插件，用于生成 Vuex store 模型、模块和相应组件

- 主要面向`electron`应用，存储`nedb`或`lowdb`的持久化数据到用户数据目录下的`data`文件夹内

- 面向`typescript`应用

- 使用`hygen`作为通用的代码生成工具

- 使用了`@vuex-orm`和`vuex-pathify`简化`vuex`的操作流程

- 所有的`crud`操作封装在`ormPlugin`的`Query`生命周期钩子里

- 实现零配置的`Vuex`状态、持久化数据`lowdb`的同步更新。

## 使用方法

- 如果没有，请使用`vue-cli`进行安装其他插件

```sh
$ vue add typescript
$ vue add vue-cli-plugin-electron-builder
```

- 使用`vue-cli`进行安装本插件

```sh
$ vue add vue-cli-plugin-vuex-orm-generator
```

- 使用`Invoke`可生成新的存储模块和对应的组件:

```sh
$ vue invoke vue-cli-plugin-vuex-orm-generator
```

## 自动生成的主要文件

请注意：如果文件已经存在，将覆盖现有文件

**存储入口文件**
`store/index.ts`

**路由文件**
`router/index.ts`
`router/path.ts`

**基本的数据模型**
`api/models`

**Db 的 API，主要在 actions 中异步调用**

`api/lowdb`

**Store 插件，加入了orm**

```sh
store/plugins/index.ts
store/plugins/ormPlugin.ts
store/plugins/lowedbPlugin.ts
store/plugins/pathify.ts
```

**自动生成模型/模块/混入/组件**

```sh
yarn new model
yarn new module
yarn new mixins
yarn new component-table
yarn new component-form
```

## 问题：

1. `require.context` is not functino error

Install `webpack-env` and set `tsconfig.json` like this

```
{
    "types": {
        "webpack",
        "webpack-env",
    }
}
```

## 借鉴：

[vue-cli-plugin-vuex-module-generator](https://github.com/paulgv/vue-cli-plugin-vuex-module-generator)

[vue-cli-plugin-vuex-nedb-module-generator](https://github.com/linuxing3/vue-cli-plugin-vuex-nedb-module-generator)
