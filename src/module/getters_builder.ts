import { Getter, GetterTree } from "vuex";
import { isValidPath, dig } from "../utils/object_util";

const makeGet = (initialState: any, stateName: string): Getter<any, any> => {
  return (state: any) => (key: string) => {
    const fullPath = `${stateName}.${key}`;
    if (!isValidPath(initialState, fullPath)) {
      throw new Error(`${key} is invalid path.`);
    }
    return dig(state, fullPath);
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

function build(initialState: any): GetterTree<any, any> {
  return Object.keys(initialState).reduce((acc: any, stateName: string) => {
    if (Array.isArray(initialState[stateName])) {
      acc[`${stateName}$find`] = makeFind(stateName);
      acc[`${stateName}$filter`] = makeFilter(stateName);
    } else if (initialState[stateName] instanceof Object) {
      acc[`${stateName}$get`] = makeGet(initialState, stateName);
    }
    acc[stateName] = makeGetter(stateName);
    return acc;
  }, {});
}

export default build;
