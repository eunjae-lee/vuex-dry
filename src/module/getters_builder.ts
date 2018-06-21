import { Getter, GetterTree } from "vuex";
import BuildConfig, { StateConfig } from "./build_config";
import has from "lodash.has";
import get from "lodash.get";

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
  if (!has(initialState, fullPath)) {
    throw new Error(`${key} is invalid path.`);
  }
  return get(state, fullPath);
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
      return get(state, `${stateName}.${key}`);
    } else {
      return getStrictly(state, stateName, key, initialState);
    }
  };
};

const makeFind = (stateName: string): Getter<any, any> => {
  return (state: any) => (...args: Array<any>) => {
    if (args.length == 1 && args[0] instanceof Function) {
      const test: Function = args[0];
      return state[stateName].find(test);
    } else if (args.length == 2 && typeof args[0] == "string") {
      const columnName = args[0];
      const columnValue = args[1];
      return state[stateName].find((x: any) => x[columnName] == columnValue);
    } else {
      throw new Error("Unrecognized parameters for $find");
    }
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

function build(buildConfig: BuildConfig): GetterTree<any, any> {
  const initialState = buildConfig.state();
  return Object.keys(initialState).reduce((acc: any, stateName: string) => {
    if (Array.isArray(initialState[stateName])) {
      acc[`${stateName}$find`] = makeFind(stateName);
      acc[`${stateName}$filter`] = makeFilter(stateName);
    } else if (initialState[stateName] instanceof Object) {
      acc[`${stateName}$get`] = makeGet(
        initialState,
        stateName,
        buildConfig.config
      );
    }
    acc[stateName] = makeGetter(stateName);
    return acc;
  }, {});
}

export default build;
