---
to: "src/components/<%= h.capitalize(h.inflection.singularize(model)) %>/<%= h.capitalize(h.inflection.singularize(model)) %>List.vue"
---
<%
  const modelName = h.capitalize(h.inflection.singularize(model))
  const modelListName = h.capitalize(h.inflection.singularize(model)) + 'List'
  const modelFormName = h.capitalize(h.inflection.singularize(model)) + 'Form'
%><script>
import <%= modelName %> from "@/api/models/<%= modelName %>";
import <%= modelFormName %> from "./<%= modelFormName %>";
import exportMixin from "@/mixins/exportMixin";
export default {
  components: {
    <%= modelFormName %>
  },
  data() {
    return {
      editing: false,
    }
  },
  computed: {
    modelName: () => <%= modelName %>.entity,
    all: () => <%= modelName %>.query().withAll().get(),
    headers: () => <%= modelName %>.fieldsKeys(),
  },
  mixins: [exportMixin],
  created() {
    window.<%= modelListName %> = this;
  },
  methods: {
    deleteItem(item) {
      <%= modelName %>.delete(item._id);
    },
    editItem(item) {
      window.<%= modelFormName %>.$emit("SET_EDITING", item);
    }
  },
}
</script>

<template>
  <div>
    <h3 class="heading pa-3">{{ modelName }}</h3>
    <v-list
        dense
        expand
      >
      <v-list-group
          v-for="(item, i) in all"
          :key="i"
          :group="i"
          prepend-icon=""
          no-action="no-action"
        >
        <v-list-tile
            slot="activator"
            ripple="ripple"
          >
          <v-list-tile-content>
            <h4 class="white--text pa-1">
              {{ item.name }}
            </h4>
          </v-list-tile-content>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </div>
</template>
