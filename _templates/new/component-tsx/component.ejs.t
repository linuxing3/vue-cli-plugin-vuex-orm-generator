---
to: "src/components/<%= h.capitalize(h.inflection.singularize(model)) %>/<%= h.capitalize(h.inflection.singularize(model)) %>.tsx"
---
<%
  const modelName = h.capitalize(h.inflection.singularize(model))
%>import { VNode } from "vue";
import { component } from "vue-tsx-support";

import {
  VFlex,
  VIcon,
  VLayout,
} from "vuetify-tsx";


const <%= modelName %>Component = component({
    render(): VNode {
      return (
        <VLayout row wrap>
          <VFlex md4>
            <h1><%= modelName %></h1>
          </VFlex>
          <VFlex md8>
            <VBtn to={{ name: "home"}} >
              <div>主页</div>
            </VBtn>
          </VFlex>
        </VLayout>
      )
    }
});

export default <%= modelName %>Component;
