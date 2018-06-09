import { Mutation, MutationTree } from "vuex";

interface ArrayMutationPayLoad {
  key: string;
  value: any;
}

function defaultMutations(): MutationTree<any> {
  return {
    $add(state: any, payload: ArrayMutationPayLoad) {
      state[payload.key].push(payload.value);
    }
  };
}

export default defaultMutations;
