---
to: "src/components/<%= h.capitalize(h.inflection.singularize(model)) %>/<%= h.capitalize(h.inflection.singularize(model)) %>Table.vue"
---
<%
  const modelName = h.capitalize(h.inflection.singularize(model))
  const modelTableName = h.capitalize(h.inflection.singularize(model)) + 'Table'
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
    all: () =><%= modelName %>.query().withAll().get(),
    headers: () => <%= modelName %>.fieldsKeys(),
  },
  mixins: [exportMixin],
  created() {
    window.<%= modelTableName %> = this;
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
  <v-card>
    <v-responsive>
      <v-data-table
          :headers="headers"
          :items="all"
          class="elevation-0"
        >
        <template
            slot="headers"
            slot-scope="props">
          <tr>
            <th
                class="text-xs-left"
                key="action">
              {{ $t('action') }}
            </th>
            <th
                v-for="header in props.headers"
                class="text-xs-left"
                :key="header">
              {{ $t !== undefined ? $t(header) : header }}
            </th>
          </tr>
        </template>
        <template
            slot="items"
            slot-scope="props">
          <td class="justify-center layout px-0">
            <v-btn
                icon
                class="mx-0"
                @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn
                icon
                class="mx-0"
                @click="deleteItem(props.item)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
            <v-btn
                icon
                class="mx-0"
                @click="exportItem(props.item)">
              <v-icon color="pink">fas fa-print</v-icon>
            </v-btn>
          </td>
          <td
              class="text-xs-left"
              :key="header"
              :autocomplete="props.item[header]"
              v-for="header in headers">
            {{ props.item[header] }}
          </td>
        </template>
      </v-data-table>

    </v-responsive>
    <v-responsive>
    </v-responsive>
  </v-card>
</template>
<style lang="scss" module>
</style>
