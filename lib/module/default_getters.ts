import { Getter, GetterTree } from "vuex";
import BuildConfig from "./build_config";
import { isValidPath, dig } from "../utils/object_util";

const makeGet = (initialState: any): Getter<any, any> => {
  return (state: any) => (key: string) => {
    if (!isValidPath(initialState, key)) {
      throw new Error(`${key} is invalid path.`);
    }
    return dig(state, key);
  };
};

function defaultGetters(initialState: any): GetterTree<any, any> {
  return {
    $get: makeGet(initialState)
  };
}

export default defaultGetters;
