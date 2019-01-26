import Vue from "vue";
import Vuex from "vuex";
import { LowdbForElectron } from "@/api/lowdb";
import models from "@/api/models";
import plugins from "./plugins";
// import modules from "./modules"

const entities = Object.keys(models);

Vue.use(Vuex);

/**
 * Create lowdb files and set default fields
 * @return {Object} entitiesDb, ex: {user: DB}
 */
const pool = entities.reduce((entitiesDb, entity) => {
  const DB = new LowdbForElectron(entity);
  DB.dbCreate(entity);
  entitiesDb[entity] = DB;
  return entitiesDb;
}, Object.create(null));

export default new Vuex.Store({
  state: { pool, entities },
  // modules,
  plugins,
});
