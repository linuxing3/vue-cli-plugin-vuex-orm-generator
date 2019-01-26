/* eslint-disable */
import Vue from "vue";
import Router, { RouteConfig } from "vue-router";

Vue.use(Router);

import { routes } from "./routes";

/**
 * 动态路由
 */
let requiredRoute = require.context(".", false, /\.ts$/);

requiredRoute.keys().forEach(key => {
  if (key === "./index.ts" || key === "./path.awesome.ts") return;
  routes.push(requiredRoute(key).default || requiredRoute(key));
});

const router = new Router({
  routes: routes as RouteConfig[],
});

// router gards
router.beforeEach((to: any, from: any, next: any) => {
  console.log("Going From " + from.path + " to " + to.path);
  next();
});

router.afterEach((to: any, from: any) => {
  console.log("Arrived " + to.path + " from " + from.path);
});

export default router;
