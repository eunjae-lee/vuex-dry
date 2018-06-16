'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var has = _interopDefault(require('lodash.has'));
var get = _interopDefault(require('lodash.get'));
var merge = _interopDefault(require('lodash.merge'));

function build(buildConfig) {
    return buildConfig.state();
}

const getStrictly = (state, stateName, key, initialState) => {
    const fullPath = `${stateName}.${key}`;
    if (!has(initialState, fullPath)) {
        throw new Error(`${key} is invalid path.`);
    }
    return get(state, fullPath);
};
const makeGet = (initialState, stateName, config) => {
    const nonStrictState = ((config || {}).nonStrictObject || []).indexOf(stateName) != -1;
    return (state) => (payload) => {
        const key = typeof payload == "string" ? payload : payload.key;
        const strict = typeof payload == "string" ? true : payload.strict;
        if (strict === false || nonStrictState) {
            return get(state, `${stateName}.${key}`);
        }
        else {
            return getStrictly(state, stateName, key, initialState);
        }
    };
};
const makeFind = (stateName) => {
    return (state) => (test) => {
        return state[stateName].find(test);
    };
};
const makeFilter = (stateName) => {
    return (state) => (test) => {
        return state[stateName].filter(test);
    };
};
const makeGetter = (stateName) => {
    return (state) => state[stateName];
};
function build$1(buildConfig) {
    const initialState = buildConfig.state();
    return Object.keys(initialState).reduce((acc, stateName) => {
        if (Array.isArray(initialState[stateName])) {
            acc[`${stateName}$find`] = makeFind(stateName);
            acc[`${stateName}$filter`] = makeFilter(stateName);
        }
        else if (initialState[stateName] instanceof Object) {
            acc[`${stateName}$get`] = makeGet(initialState, stateName, buildConfig.config);
        }
        acc[stateName] = makeGetter(stateName);
        return acc;
    }, {});
}

function deepSet(obj, key, value) {
    const keys = key.split(".");
    const keysExceptForTheLast = keys.slice(0, keys.length - 1);
    const lastKey = keys[keys.length - 1];
    let leafObject;
    if (keysExceptForTheLast.length > 0) {
        leafObject = get(obj, keysExceptForTheLast);
    }
    else {
        leafObject = obj;
    }
    leafObject[lastKey] = value;
}
function buildNestedObject(keys, leafValue) {
    const obj = {};
    keys.reduce((acc, key, index, keys) => {
        if (keys.length - 1 == index) {
            acc[key] = leafValue;
        }
        else {
            acc[key] = {};
        }
        return acc[key];
    }, obj);
    return obj;
}

const testFn = (test, value) => {
    if (test instanceof Function) {
        return test;
    }
    else if (typeof test == "string") {
        return (item) => item[test] == value[test];
    }
};
const makeAdd = (stateName) => {
    return (state, value) => {
        state[stateName].push(value);
    };
};
const makeDelete = (stateName) => {
    return (state, test) => {
        const index = state[stateName].findIndex(test);
        if (index != -1) {
            state[stateName].splice(index, 1);
        }
    };
};
const makeUpdate = (stateName) => {
    return (state, payload) => {
        const test = testFn(payload.test, payload.value);
        const index = state[stateName].findIndex(test);
        if (index == -1) {
            state[stateName].push(payload.value);
        }
        else {
            state[stateName].splice(index, 1, payload.value);
        }
    };
};
const makeSet = (stateName, config) => {
    const nonStrictState = ((config || {}).nonStrictObject || []).indexOf(stateName) != -1;
    return (state, payload) => {
        if (payload.strict === false || nonStrictState) {
            if (!state[stateName]) {
                throw new Error(`${stateName} does not exist in state.`);
            }
            const obj = buildNestedObject(payload.key.split("."), payload.value);
            state[stateName] = merge({}, state[stateName], obj);
        }
        else {
            if (!has(state[stateName], payload.key)) {
                throw new Error(`${payload.key} is not valid path.`);
            }
            deepSet(state[stateName], payload.key, payload.value);
        }
    };
};
const makeReset = (stateName, buildConfig) => {
    return (state) => {
        state[stateName] = buildConfig.state()[stateName];
    };
};
const makeResetAll = (buildConfig) => {
    return (state) => {
        const initialState = buildConfig.state();
        Object.keys(initialState).forEach((key) => {
            state[key] = initialState[key];
        });
    };
};
const makeAssign = (stateName) => {
    return (state, payload) => (state[stateName] = payload);
};
function build$2(buildConfig) {
    const initialState = buildConfig.state();
    return Object.keys(initialState).reduce((acc, stateName) => {
        if (Array.isArray(initialState[stateName])) {
            acc[`${stateName}$add`] = makeAdd(stateName);
            acc[`${stateName}$delete`] = makeDelete(stateName);
            acc[`${stateName}$update`] = makeUpdate(stateName);
        }
        else if (initialState[stateName] instanceof Object) {
            acc[`${stateName}$set`] = makeSet(stateName, buildConfig.config);
        }
        acc[`${stateName}$assign`] = makeAssign(stateName);
        acc[`${stateName}$reset`] = makeReset(stateName, buildConfig);
        return acc;
    }, {
        $resetAll: makeResetAll(buildConfig)
    });
}

const makeAssign$1 = (stateName) => {
    return (context, payload) => context.commit(`${stateName}$assign`, payload);
};
const makeReset$1 = (stateName) => {
    return (context) => context.commit(`${stateName}$reset`);
};
const makeResetAll$1 = () => {
    return (context) => context.commit("$resetAll");
};
function build$3(buildConfig) {
    const initialState = buildConfig.state();
    return Object.keys(initialState).reduce((acc, stateName, index) => {
        acc[`${stateName}$assign`] = makeAssign$1(stateName);
        acc[`${stateName}$reset`] = makeReset$1(stateName);
        return acc;
    }, {
        $resetAll: makeResetAll$1()
    });
}

const Module = {
    build(buildConfig) {
        return {
            namespaced: true,
            state: build(buildConfig),
            getters: Object.assign({}, build$1(buildConfig), buildConfig.getters),
            mutations: Object.assign({}, build$2(buildConfig), buildConfig.mutations),
            actions: Object.assign({}, build$3(buildConfig), buildConfig.actions),
            modules: buildConfig.modules
        };
    }
};

let cachedStore = undefined;
function get$1() {
    if (!cachedStore) {
        throw new Error("You haven't installed the plugin of vuex-dry.");
    }
    return cachedStore;
}
function set(store) {
    cachedStore = store;
}
var cachedStore$1 = {
    get: get$1,
    set
};

const plugin = (store) => {
    cachedStore$1.set(store);
};

function store() {
    return cachedStore$1.get();
}
function get$2(type, nestedPath) {
    if (nestedPath) {
        return () => {
            return store().getters[`${type}$get`](nestedPath);
        };
    }
    else {
        return () => {
            return store().getters[type];
        };
    }
}
function action(type) {
    return (payload) => {
        return store().dispatch(type, payload);
    };
}
function sync(type, nestedPath) {
    if (nestedPath) {
        return {
            get() {
                return store().getters[`${type}$get`](nestedPath);
            },
            set(value) {
                store().commit(`${type}$set`, { key: nestedPath, value: value });
            }
        };
    }
    else {
        return {
            get() {
                return store().getters[type];
            },
            set(value) {
                store().commit(`${type}$assign`, value);
            }
        };
    }
}

exports.Module = Module;
exports.plugin = plugin;
exports.get = get$2;
exports.action = action;
exports.sync = sync;
