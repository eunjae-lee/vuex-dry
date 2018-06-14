import { MutationTree } from "vuex";
import { isValidPath, deepSet } from "../utils/object_util";
import { StateConfig } from "./build_config";

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
      state[stateName][index] = payload.value;
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
      const keys = payload.key.split(".");
      const keysExceptForLast = keys.slice(0, keys.length - 1);
      const lastKey = keys[keys.length - 1];
      let obj = state[stateName];
      keysExceptForLast.forEach(key => {
        if (!obj.hasOwnProperty(key)) {
          obj[key] = {};
        }
        obj = obj[key];
      });
      obj[lastKey] = payload.value;
    } else {
      if (!isValidPath(state[stateName], payload.key)) {
        throw new Error(`${payload.key} is not valid path.`);
      }
      deepSet(state[stateName], payload.key, payload.value);
    }
  };
};

const makeReset = (stateName: string, initialState: any) => {
  return (state: any) => {
    state[stateName] = initialState[stateName];
  };
};

const makeResetAll = (initialState: any) => {
  return (state: any) => {
    Object.keys(initialState).forEach((key: string) => {
      state[key] = initialState[key];
    });
  };
};

const makeAssign = (stateName: string) => {
  return (state: any, payload: any) => (state[stateName] = payload);
};

function build(initialState: any, config?: StateConfig): MutationTree<any> {
  return Object.keys(initialState).reduce(
    (acc: any, stateName: string) => {
      if (Array.isArray(initialState[stateName])) {
        acc[`${stateName}$add`] = makeAdd(stateName);
        acc[`${stateName}$delete`] = makeDelete(stateName);
        acc[`${stateName}$update`] = makeUpdate(stateName);
      } else if (initialState[stateName] instanceof Object) {
        acc[`${stateName}$set`] = makeSet(stateName, config);
      }
      acc[`${stateName}$assign`] = makeAssign(stateName);
      acc[`${stateName}$reset`] = makeReset(stateName, initialState);
      return acc;
    },
    {
      $resetAll: makeResetAll(initialState)
    }
  );
}

export default build;
