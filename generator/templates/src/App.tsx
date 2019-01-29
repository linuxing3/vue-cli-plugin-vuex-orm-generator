import { VNode } from "vue";
import { component } from "vue-tsx-support";


const App = component({
  name: "App",
  render(): VNode {
    return <router-view />;
  }
});

export default App;
