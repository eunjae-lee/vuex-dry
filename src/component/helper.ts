import cachedStore from "./cached_store";

function store() {
  return cachedStore.get();
}

export function get(type: string, nestedPath?: string) {
  if (nestedPath) {
    return () => {
      return store().getters[`${type}$get`](nestedPath);
    };
  } else {
    return () => {
      return store().getters[type];
    };
  }
}

export function action(type: string) {
  return (payload?: any) => {
    return store().dispatch(type, payload);
  };
}

export function runAction(type: string, payload?: any) {
  store().dispatch(type, payload);
}

export function sync(type: string, nestedPath?: string) {
  if (nestedPath) {
    return {
      get() {
        return store().getters[`${type}$get`](nestedPath);
      },
      set(value: any) {
        store().commit(`${type}$set`, { key: nestedPath, value: value });
      }
    };
  } else {
    return {
      get() {
        return store().getters[type];
      },
      set(value: any) {
        store().commit(`${type}$assign`, value);
      }
    };
  }
}
