let cachedStore: any = undefined;

function get() {
  return cachedStore;
}

function set(store: any) {
  cachedStore = store;
}

export default {
  get,
  set
};
