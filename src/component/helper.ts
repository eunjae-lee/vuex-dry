import cachedStore from "./cached_store";

function store() {
  return cachedStore.get();
}

export function get(type: string) {
  return () => {
    return store().getters[type];
  };
}

export function action(type: string) {
  return (payload?: any) => {
    return store().dispatch(type, payload);
  };
}

export function sync(type: string) {
  return {
    get() {
      return store().getters[type];
    },
    set(value: any) {
      store().commit(`${type}$assign`, value);
    }
  };
}
