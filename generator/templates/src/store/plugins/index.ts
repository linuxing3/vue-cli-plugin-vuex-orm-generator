import pathifyPlugin from "./pathifyPlugin";
import ormPlugin from "./ormPlugin";
import lowdbPlugins from "./lowdbPlugin";
export default [
  // pathify plugins stuff
  pathifyPlugin.plugin,
  // orm plugins stuff
  ormPlugin,
  ...lowdbPlugins(),
  // lowdb plugins stuff
];
