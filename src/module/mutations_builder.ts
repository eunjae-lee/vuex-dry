import { Mutation, MutationTree } from "vuex";
import { capitalize } from "../utils/string_util";

function mutationName(key: string) {
  return `set${capitalize(key)}`;
}

function mutation(key: string): Mutation<any> {
  return (state: any, payload: any) => (state[key] = payload);
}

function build(initialState: any): MutationTree<any> {
  return Object.keys(initialState).reduce(
    (acc: any, key: string, index: number) => {
      acc[mutationName(key)] = mutation(key);
      return acc;
    },
    {}
  );
}

export default build;
