---
to: src/store/modules/<%= h.capitalize(h.inflection.singularize(name)) %>.ts
---
import { make } from "vuex-pathify";
export const state = {
  name: "<%= h.inflection.camelize(h.inflection.singularize(name)) %>",
  items: [],
  currentItem: {},
  status: "",
  filter: {
    search: "",
    sort: "",
  },
}

export const getters = {
  ...make.getters(state),
}

export const mutations = {
  ...make.mutations(state),
}

export const actions = {
  ...make.actions(state),
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
