import { Mutation, MutationTree } from "vuex";

interface ArrayAddPayLoad {
  state: string;
  value: any;
}

interface ArrayDeletePayload {
  state: string;
  identifier: Function;
}

interface ArrayUpdatePayload {
  state: string;
  value: any;
  identifier: Function;
}

interface ObjectSetPayload {
  state: string;
  key: string;
  value: any;
}

const $add = (state: any, payload: ArrayAddPayLoad) => {
  state[payload.state].push(payload.value);
};

const $delete = (state: any, payload: ArrayDeletePayload) => {
  const index = state[payload.state].findIndex(payload.identifier);
  if (index != -1) {
    state[payload.state].splice(index, 1);
  }
};

const $update = (state: any, payload: ArrayUpdatePayload) => {
  const index = state[payload.state].findIndex(payload.identifier);
  if (index == -1) {
    $add(state, { state: payload.state, value: payload.value });
  } else {
    state[payload.state][index] = payload.value;
  }
};

const $set = (state: any, payload: ObjectSetPayload) => {
  state[payload.state][payload.key] = payload.value;
};

function defaultMutations(): MutationTree<any> {
  return {
    $add,
    $delete,
    $update,
    $set
  };
}

export default defaultMutations;
