import cachedStore from "./cached_store";

function store() {
  return cachedStore.get();
}

function usedAsComputedWatcher(vueComponent: any, fn: any) {
  if (
    !vueComponent ||
    !vueComponent._isVue ||
    !vueComponent._computedWatchers
  ) {
    return false;
  }

  const watchers = Object.keys(vueComponent._computedWatchers).map(
    key => vueComponent._computedWatchers[key]
  );
  return watchers.some((watcher: any) => watcher.getter == fn);
}

function doGet(type: string, nestedPath?: string) {
  if (nestedPath) {
    return store().getters[`${type}$get`](nestedPath);
  } else {
    return store().getters[type];
  }
}

function getBinder(type: string, nestedPath?: string) {
  return () => doGet(type, nestedPath);
}

export function get(this: any, type: string, nestedPath?: string) {
  if (usedAsComputedWatcher(this, get)) {
    return getBinder(type, nestedPath);
  } else {
    return doGet(type, nestedPath);
  }
}

function doAction(type: string, payload?: any) {
  return store().dispatch(type, payload);
}

function actionBinder(type: string) {
  return (payload?: any) => doAction(type, payload);
}

export function action(this: any, type: string, payload?: any) {
  if (usedAsComputedWatcher(this, action)) {
    if (payload) {
      console.error("When you use `action` as mapper, you can't pass payload.");
    }
    return actionBinder(type);
  } else {
    return doAction(type, payload);
  }
}

export function commit(this: any, type: string, payload?: any) {
  if (usedAsComputedWatcher(this, commit)) {
    console.error("You cannot use `commit` as a binder at `computed`.");
  } else {
    store().commit(type, payload);
  }
}

export function runAction(type: string, payload?: any) {
  console.info(
    "`runAction` from `vuex-dry` is DEPRECATED. Please use `action` instead."
  );
  return store().dispatch(type, payload);
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
