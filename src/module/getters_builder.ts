import { errorThrower } from "../utils/error_thrower";
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
    const e = errorThrower(
      `Cannot find a key("${key}") from state("${stateName}").`
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
    const key = typeof payload == "string" ? payload : payload.key.toString();
    const strict = typeof payload == "string" ? true : payload.strict;

    if (!key) {
      const e = errorThrower(`Invalid key("${key}")`);
      e.add(
        `You tried to access a state("${stateName}") with an invalid key("${key}").`
      );
      e.logAndThrow();
    }

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
      const key = args[0];
      const value = args[1];
      return state[stateName].find((x: any) => x[key] == value);
    } else {
      const e = errorThrower("Invalid parameters for $find");
      e.add("You passed wrong parameters for $find.");
      e.add(`What you just passed => ${args}`);
      e.add("You might try again with");
      e.add("  1. a function");
      e.add(`       > getters["${stateName}$find"](x => x.id == 3)`);
      e.add("     or");
      e.add("  2. a key and its expected value");
      e.add(`       > getters["${stateName}$find"]("id", 3)`);
      e.logAndThrow();
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
