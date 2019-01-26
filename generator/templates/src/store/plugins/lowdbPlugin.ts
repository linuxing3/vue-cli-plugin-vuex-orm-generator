import { LowdbForElectron } from "@/api/lowdb";
import { stateObjectFromArray } from "@/util/transformer";
import { Model } from "@vuex-orm/core";
import models from "@/api/models";

const lowdbPlugin = options => {
  const entity = options.namespace || "data";
  return store => {
    /**
     * Load the data from lowdb and commit to initial State
     */
    const DB: LowdbForElectron = new LowdbForElectron(entity);
    const entityArray: any[] = DB.all(entity);
    const NSModel: Model = models[entity];

    if (Array.isArray(entityArray)) {
      NSModel.commit(state => (state.data = stateObjectFromArray(entityArray)));
      // entityArray.map(item => NSModel.insert({data: item}))
    }

  };
};

const lowdbPlugins = () => {
  let plugins = [];
  Object.keys(models).forEach(entity => {
    plugins.push(lowdbPlugin({ namespace: entity }));
  });
  return plugins;
};

export default lowdbPlugins;
