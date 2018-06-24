import { errorThrower } from "../utils/error_thrower";
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
  return (state: any, test: Function | Array<any>) => {
    let index = -1;
    if (test instanceof Function) {
      index = state[stateName].findIndex(test);
    } else if (Array.isArray(test) && test.length == 2) {
      const key = test[0];
      const value = test[1];
      index = state[stateName].findIndex((x: any) => x[key] == value);
    } else {
      const e = errorThrower("Invalid parameters for $delete");
      e.add("You passed wrong parameters for $delete.");
      e.add(`What you just passed => ${test}`);
      e.add("You might try again with");
      e.add("  1. a function");
      e.add(`       > commit("${stateName}$find", x => x.id == 3)`);
      e.add("     or");
      e.add("  2. a key and its expected value");
      e.add(`       > commit("${stateName}$find", { key: "id", value: 3 })`);
      e.logAndThrow();
    }
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
    const key = payload.key.toString();
    if (payload.strict === false || nonStrictState) {
      if (!state[stateName]) {
        const e = errorThrower(`${stateName} does not exist in state.`);
        e.add(
          `You tried to set value to state with a key("${stateName}"), but it doesn't exist.`
        );
        e.add("Check your module definition again.");
        e.logAndThrow();
      }
      const obj = buildNestedObject(key.split("."), payload.value);
      state[stateName] = merge({}, state[stateName], obj);
    } else {
      if (!has(state[stateName], key)) {
        const e = errorThrower(
          `Cannot set a key("${key}") at state("${stateName}").`
        );
        e.add("You might try to");
        e.add("  1. check if the key is pre-defined");
        e.add("     or");
        e.add("  2. make the state non-strict");
        e.add("       > To do that, please check the following url");
        e.add(
          "         https://github.com/eunjae-lee/vuex-dry/blob/master/DOCUMENT.md#non-strict-object"
        );
        e.logAndThrow();
      }
      deepSet(state[stateName], key, payload.value);
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
