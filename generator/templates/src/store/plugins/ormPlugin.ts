import VuexORM, { Database, Query, Model } from "@vuex-orm/core";
import models from "@/api/models";
import modules from "@/store/modules";
import { curry } from "lodash";

import { LowdbForElectron } from "@/api/lowdb";
/**
 * Query hooks
 */

Query.on("afterCreate", function(model: Model) {

  const entity = model.$self().entity;
  console.log("Create Hook in " + entity);
  const DB: LowdbForElectron = new LowdbForElectron(entity);
  DB.insert(entity, model);
});

Query.on("beforeDelete", function(model: Model) {

  const { entity } = (this as Query);
  console.log("Delete Hook in " + entity);
  const DB: LowdbForElectron = new LowdbForElectron(entity);
  DB.delete(entity, { _id: model._id });
  
});

Query.on("afterUpdate", function(model: Model) {
  const entity = model.$self().entity;
  console.log("Update Hook in " + entity);
  const DB: LowdbForElectron = new LowdbForElectron(entity);
  DB.update(entity, { _id: model._id }, model);
});

/**
 * Database register model and modules
 */
export const registerDatabase = (models: any, modules: any): Database => {
  const database = new Database();
  Object.keys(models).map(key => {
    console.log(`Registering ORM for ${key} model`);
    database.register(models[key], modules[key] || {});
  });
  return database;
};

export const curriedRegisterDatabase = curry(registerDatabase);
export const curriedDatabase = curriedRegisterDatabase(models)(modules);

/**
 * Register database as Vuex plugin
 */
export const database = registerDatabase(models, modules);

const ormPlugin = VuexORM.install(database);

export default ormPlugin;
