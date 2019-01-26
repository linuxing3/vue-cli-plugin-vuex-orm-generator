---
to: src/router/<%= h.capitalize(h.inflection.singularize(model)) %>.ts
---
<%
  const modelName = h.capitalize(h.inflection.singularize(model))
  const pathName = (h.inflection.singularize(model)).toLowerCase()
%>export default {
  path: "/<%= pathName %>",
  name: "<%= modelName %>",
  meta: { breadcrumb: true },
  component: () =>
    import(/* webpackChunkName: "routes" */
    /* webpackMode: "lazy" */
    `@/components/<%= modelName %>/<%= modelName %>Table.vue`)
};
