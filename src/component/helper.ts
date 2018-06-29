import cachedStore from "./cached_store";

function store() {
  return cachedStore.get();
}

interface InstanceKey {
  this: string;
}

const evalKey = (self: any, key: string | InstanceKey) => {
  if (typeof key == "string") {
    return key;
  } else {
    return self[key.this];
  }
};

export function $get(type: string, nestedPath?: string) {
  if (nestedPath) {
    return store().getters[`${type}$get`](nestedPath);
  } else {
    return store().getters[type];
  }
}

export function get(
  type: string | InstanceKey,
  nestedPath?: string | InstanceKey
) {
  return function(this: any) {
    const _type = evalKey(this, type);
    const _nestedPath = nestedPath ? evalKey(this, nestedPath) : undefined;
    return $get(_type, _nestedPath);
  };
}

export function $action(type: string, payload?: any) {
  return store().dispatch(type, payload);
}

export function action(type: string | InstanceKey) {
  return function(this: any, payload?: any) {
    return $action(evalKey(this, type), payload);
  };
}

export function $commit(type: string, payload?: any) {
  store().commit(type, payload);
}

export function runAction(type: string, payload?: any) {
  console.info(
    "`runAction` from `vuex-dry` is DEPRECATED. Please use `$action` instead."
  );
  return store().dispatch(type, payload);
}

export function sync(
  type: string | InstanceKey,
  nestedPath?: string | InstanceKey
) {
  return {
    get() {
      if (nestedPath) {
        const getter = store().getters[`${evalKey(this, type)}$get`];
        return getter(evalKey(this, nestedPath));
      } else {
        return store().getters[evalKey(this, type)];
      }
    },
    set(value: any) {
      if (nestedPath) {
        store().commit(`${evalKey(this, type)}$set`, {
          key: evalKey(this, nestedPath),
          value: value
        });
      } else {
        store().commit(`${evalKey(this, type)}$assign`, value);
      }
    }
  };
}
