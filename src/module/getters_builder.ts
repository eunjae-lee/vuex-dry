import { Getter, GetterTree } from "vuex";
import { isValidPath, dig } from "../utils/object_util";
import { StateConfig } from "./build_config";

interface ObjectGetPayload {
  key: string;
  strict: boolean;
}

const getStrictly = (
  state: any,
  stateName: string,
  key: string,
  initialState: any
) => {
  const fullPath = `${stateName}.${key}`;
  if (!isValidPath(initialState, fullPath)) {
    throw new Error(`${key} is invalid path.`);
  }
  return dig(state, fullPath);
};

const makeGet = (
  initialState: any,
  stateName: string,
  config?: StateConfig
): Getter<any, any> => {
  const nonStrictState =
    ((config || {}).nonStrictObject || []).indexOf(stateName) != -1;

  return (state: any) => (payload: string | ObjectGetPayload) => {
    const key = typeof payload == "string" ? payload : payload.key;
    const strict = typeof payload == "string" ? true : payload.strict;

    if (strict === false || nonStrictState) {
      return dig(state, `${stateName}.${key}`, false);
    } else {
      return getStrictly(state, stateName, key, initialState);
    }
  };
};

const makeFind = (stateName: string): Getter<any, any> => {
  return (state: any) => (test: Function) => {
    return state[stateName].find(test);
  };
};

const makeFilter = (stateName: string): Getter<any, any> => {
  return (state: any) => (test: Function) => {
    return state[stateName].filter(test);
  };
};
const makeGetter = (stateName: string) => {
  return (state: any) => state[stateName];
};

function build(initialState: any, config?: StateConfig): GetterTree<any, any> {
  return Object.keys(initialState).reduce((acc: any, stateName: string) => {
    if (Array.isArray(initialState[stateName])) {
      acc[`${stateName}$find`] = makeFind(stateName);
      acc[`${stateName}$filter`] = makeFilter(stateName);
    } else if (initialState[stateName] instanceof Object) {
      acc[`${stateName}$get`] = makeGet(initialState, stateName, config);
    }
    acc[stateName] = makeGetter(stateName);
    return acc;
  }, {});
}

export default build;
