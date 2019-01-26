---
to: "src/components/<%= h.capitalize(h.inflection.singularize(model)) %>/<%= h.capitalize(h.inflection.singularize(model)) %>Form.vue"
---
<%
  const modelName = h.capitalize(h.inflection.singularize(model))
  const modelTableName = h.capitalize(h.inflection.singularize(model)) + 'Table'
  const modelFormName = h.capitalize(h.inflection.singularize(model)) + 'Form'
%><script>
import <%= modelName %> from "@/api/models/<%= modelName %>";
export default {
  data() {
    return {
      editing: false,
      model: {},
    }
  },
  created() {
    this.model = new <%= modelName %>();
    this.$on("SET_EDITING", (item) => {
      this.editing = true
      this.model = item
    });
    window.<%= modelFormName %> = this;
  },
  computed: {
    modelName: () => <%= modelName %>.entity,
    fields: () => <%= modelName %>.fieldsKeys()
  },
  methods: {
    reset() {
      this.editing = false;
      this.model = new <%= modelName %>();
    },
    saveItem() {
      if(!this.editing) {
        <%= modelName %>.insert({
          data: this.model
        });
        this.model = new <%= modelName %>();
      } else {
        <%= modelName %>.update(this.model);
        this.editing = false;
        this.model = new <%= modelName %>();
      }
    }
  }
}
</script>

<template>
  <v-card>
    <v-toolbar
        card
        prominent
        extended
        color="primary"
        dark="">
      <v-toolbar-title class="headline">
        {{editing ? "你在进行编辑更新" : "你在添加模式"}}
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
          icon
          @click="reset">
        <v-icon>close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-layout wrap>
          <v-flex
              v-for="field in fields"
              :key="field"
              lg6
              sm6>
            <v-text-field
                v-model="model[field]"
                :name="field"
                :label=" $t !== undefined ? $t(field) : field">
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-form>
    </v-card-text>
    <v-card-actions class="pb-3">
      <v-spacer></v-spacer>
      <v-btn
          :color="editing ? 'warning' : 'primary'"
          @click="saveItem">{{editing ? "更新": "添加"}}</v-btn>
    </v-card-actions>
  </v-card>
</template>
<style lang="scss" module>
</style>
