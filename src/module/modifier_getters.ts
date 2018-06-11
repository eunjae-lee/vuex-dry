import { Getter, GetterTree } from "vuex";
import BuildConfig from "./build_config";
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

function modifierGetters(initialState: any): GetterTree<any, any> {
  return Object.keys(initialState).reduce((acc: any, stateName: string) => {
    acc[`${stateName}$get`] = makeGet(initialState, stateName);
    return acc;
  }, {});
}

export default modifierGetters;
