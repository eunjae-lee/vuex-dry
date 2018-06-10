let cachedStore: any = undefined;

function get() {
  if (!cachedStore) {
    throw new Error("You haven't installed the plugin of vuex-dry.");
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
