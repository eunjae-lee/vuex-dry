import cachedStore from "./cached_store";

function store() {
  return cachedStore.get();
}

export function get(moduleName: string, key: string) {
  return () => {
    return store().getters[`${moduleName}/${key}`];
  };
}

export function action(type: string) {
  return (payload?: any) => {
    return store().dispatch(type, payload);
  };
}

export function sync(moduleName: string, key: string) {
  return {
    get() {
      return store().getters[`${moduleName}/${key}`];
    },
    set(value: any) {
      store().commit(`${moduleName}/${key}`, value);
    }
  };
}
