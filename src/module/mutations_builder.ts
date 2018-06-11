import { Mutation, MutationTree } from "vuex";

function mutationName(key: string) {
  return `${key}$assign`;
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
