import { Mutation, MutationTree } from "vuex";
import BuildConfig from "./build_config";

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
  let obj = state;
  const keys = payload.state.split(".");
  const keysExceptForTheLast = keys.slice(0, keys.length - 1);
  const lastKey = keys[keys.length - 1];
  keysExceptForTheLast.forEach((key: string, index: number) => {
    if (!obj[key]) {
      throw new Error(`${keys.slice(0, index + 1).join(".")} is ${obj[key]}`);
    }
    obj = obj[key];
  });
  obj[lastKey] = payload.value;
};

const makeReset = (initialState: any) => {
  return (state: any, stateName: string) => {
    state[stateName] = initialState[stateName];
  };
};

const makeResetAll = (initialState: any) => {
  return (state: any) => {
    Object.keys(initialState).forEach((key: string) => {
      state[key] = initialState[key];
    });
  };
};

function defaultMutations(initialState: any): MutationTree<any> {
  return {
    $add,
    $delete,
    $update,
    $set,
    $reset: makeReset(initialState),
    $resetAll: makeResetAll(initialState)
  };
}

export default defaultMutations;
