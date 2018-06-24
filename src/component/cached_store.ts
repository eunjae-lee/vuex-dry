import { errorThrower } from "../utils/error_thrower";
let cachedStore: any = undefined;

function get() {
  if (!cachedStore) {
    errorThrower("You haven't installed the vuex-dry plugin.")
      .add(`Do the following to install the plugin:`)
      .add("")
      .add(` > import { plugin } from "vuex-dry";`)
      .add(` > `)
      .add(` > new Vuex.Store({`)
      .add(` >   plugins: [plugin],`)
      .add(` >   ...`)
      .add(` > });`)
      .logAndThrow();
  }
  return cachedStore;
}

function set(store: any) {
  cachedStore = store;
}

export default {
  get,
  set
};
