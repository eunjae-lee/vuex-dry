import { Plugin, Store } from "vuex";
import cachedStore from "./cached_store";

const plugin: Plugin<any> = (store: Store<any>) => {
  cachedStore.set(store);
};

export default plugin;
