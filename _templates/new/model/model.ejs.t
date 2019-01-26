---
to: src/api/models/<%= h.capitalize(h.inflection.singularize(model)) %>.ts
---
<%
const ModelName = h.capitalize(h.inflection.singularize(model))
const EntityName = h.inflection.singularize(model).toLowerCase()
%>import { Model, BelongsTo } from "@vuex-orm/core";
import { keys } from "lodash";

export interface I<%= ModelName %> {
   _id: string;
   <%= fieldName %>: <%= fieldType %>;
   <% fieldNames.split(",").map(field => { %><%= field %>: string;<% }) %>
}

export default class <%= ModelName %> extends Model {
  static entity = "<%= EntityName %>";

  static primaryKey = "_id";

  static fieldsKeys() {
    return keys(this.fields());
  }

  static relationFields() {
    /**
     * fields that has relations
     * return {Array} fields which value are BelongsTo
     */
    return keys(this.fields()).reduce((list, field) => {
      if (this.fields()[field] instanceof BelongsTo) {
        list.push(`${field}_id`);
        list.push(field);
      }
      return list;
    }, []);
  }

  static fields() {
    return {
      _id: this.increment(),
      <%= fieldName %>: this.<%= fieldType %>("<%= fieldValue %>"),
      <% fieldNames.split(",").map(field => { %><%= field %>: this.string("<%= field %>"),
      <% }) %>
    };
  }
}
