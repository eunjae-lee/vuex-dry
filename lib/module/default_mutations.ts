import { Mutation, MutationTree } from "vuex";

interface ArrayAddPayLoad {
  key: string;
  value: any;
}

interface ArrayDeletePayload {
  key: string;
  identifier: Function;
}

interface ArrayUpdatePayload {
  key: string;
  value: any;
  identifier: Function;
}

const $add = (state: any, payload: ArrayAddPayLoad) => {
  state[payload.key].push(payload.value);
};

const $delete = (state: any, payload: ArrayDeletePayload) => {
  const index = state[payload.key].findIndex(payload.identifier);
  if (index != -1) {
    state[payload.key].splice(index, 1);
  }
};

const $update = (state: any, payload: ArrayUpdatePayload) => {
  const index = state[payload.key].findIndex(payload.identifier);
  if (index == -1) {
    $add(state, { key: payload.key, value: payload.value });
  } else {
    state[payload.key][index] = payload.value;
  }
};

function defaultMutations(): MutationTree<any> {
  return {
    $add,
    $delete,
    $update
  };
}

export default defaultMutations;
