---
to: "src/components/<%= h.capitalize(h.inflection.singularize(model)) %>/<%= h.capitalize(h.inflection.singularize(model)) %>Iterator.vue"
---
<%
  const modelName = h.capitalize(h.inflection.singularize(model))
  const modelIteratorName = h.capitalize(h.inflection.singularize(model)) + 'Iterator'
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
    modelName: () =><%= modelName %>.entity,
    all: () =><%= modelName %>.query().withAll().get(),
    headers: () =><%= modelName %>.fieldsKeys(),
  },
  mixins: [exportMixin],
  created() {
    window.<%= modelIteratorName %> = this;
  },
  methods: {
    deleteItem(item) {
      <%= modelName %>.delete(item._id)
    },
    editItem(item) {
      window.<%= modelFormName %>.$emit("SET_EDITING", item)
    }
  },
}
</script>

<template>
  <div>
    <h3 class="heading pa-3">{{modelName}}</h3>
    <v-data-iterator
        :items="all"
        row
        wrap
      >
      <v-flex
          slot="item"
          slot-scope="props"
        >
        <v-card
            class="indigo lighten-1"
          >
          <v-card-text>
            <h4 class="white--text pa-1">
              {{ props.item.name }}
            </h4>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-data-iterator>
  </div>
</template>
