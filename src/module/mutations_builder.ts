import { MutationTree } from "vuex";
import { deepSet, buildNestedObject } from "../utils/object_util";
import BuildConfig, { StateConfig } from "./build_config";
import merge from "lodash.merge";
import has from "lodash.has";

interface ArrayUpdatePayload {
  value: any;
  test: Function | string;
}

interface ObjectSetPayload {
  key: string;
  value: any;
  strict?: boolean;
}

const testFn = (test: Function | string, value: any) => {
  if (test instanceof Function) {
    return test;
  } else if (typeof test == "string") {
    return (item: any) => item[test] == value[test];
  }
};

const makeAdd = (stateName: string) => {
  return (state: any, value: any) => {
    state[stateName].push(value);
  };
};

const makeDelete = (stateName: string) => {
  return (state: any, test: Function) => {
    const index = state[stateName].findIndex(test);
    if (index != -1) {
      state[stateName].splice(index, 1);
    }
  };
};

const makeUpdate = (stateName: string) => {
  return (state: any, payload: ArrayUpdatePayload) => {
    const test = testFn(payload.test, payload.value);
    const index = state[stateName].findIndex(test);
    if (index == -1) {
      state[stateName].push(payload.value);
    } else {
      state[stateName].splice(index, 1, payload.value);
    }
  };
};

const makeSet = (stateName: string, config?: StateConfig) => {
  const nonStrictState =
    ((config || {}).nonStrictObject || []).indexOf(stateName) != -1;

  return (state: any, payload: ObjectSetPayload) => {
    if (payload.strict === false || nonStrictState) {
      if (!state[stateName]) {
        throw new Error(`${stateName} does not exist in state.`);
      }
      const obj = buildNestedObject(payload.key.split("."), payload.value);
      state[stateName] = merge({}, state[stateName], obj);
    } else {
      if (!has(state[stateName], payload.key)) {
        throw new Error(`${payload.key} is not valid path.`);
      }
      deepSet(state[stateName], payload.key, payload.value);
    }
  };
};

const makeReset = (stateName: string, buildConfig: BuildConfig) => {
  return (state: any) => {
    state[stateName] = buildConfig.state()[stateName];
  };
};

const makeResetAll = (buildConfig: BuildConfig) => {
  return (state: any) => {
    const initialState = buildConfig.state();
    Object.keys(initialState).forEach((key: string) => {
      state[key] = initialState[key];
    });
  };
};

const makeAssign = (stateName: string) => {
  return (state: any, payload: any) => (state[stateName] = payload);
};

function build(buildConfig: BuildConfig): MutationTree<any> {
  const initialState = buildConfig.state();
  return Object.keys(initialState).reduce(
    (acc: any, stateName: string) => {
      if (Array.isArray(initialState[stateName])) {
        acc[`${stateName}$add`] = makeAdd(stateName);
        acc[`${stateName}$delete`] = makeDelete(stateName);
        acc[`${stateName}$update`] = makeUpdate(stateName);
      } else if (initialState[stateName] instanceof Object) {
        acc[`${stateName}$set`] = makeSet(stateName, buildConfig.config);
      }
      acc[`${stateName}$assign`] = makeAssign(stateName);
      acc[`${stateName}$reset`] = makeReset(stateName, buildConfig);
      return acc;
    },
    {
      $resetAll: makeResetAll(buildConfig)
    }
  );
}

export default build;
