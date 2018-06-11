import { MutationTree } from "vuex";
import { isValidPath, deepSet } from "../utils/object_util";

interface ArrayUpdatePayload {
  value: any;
  identifier: Function | string;
}

interface ObjectSetPayload {
  key: string;
  value: any;
}

const identifierFn = (identifier: Function | string, value: any) => {
  if (identifier instanceof Function) {
    return identifier;
  } else if (typeof identifier == "string") {
    return (item: any) => item[identifier] == value[identifier];
  }
};

const makeAdd = (stateName: string) => {
  return (state: any, value: any) => {
    state[stateName].push(value);
  };
};

const makeDelete = (stateName: string) => {
  return (state: any, identifier: Function) => {
    const index = state[stateName].findIndex(identifier);
    if (index != -1) {
      state[stateName].splice(index, 1);
    }
  };
};

const makeUpdate = (stateName: string) => {
  return (state: any, payload: ArrayUpdatePayload) => {
    const identifier = identifierFn(payload.identifier, payload.value);
    const index = state[stateName].findIndex(identifier);
    if (index == -1) {
      state[stateName].push(payload.value);
    } else {
      state[stateName][index] = payload.value;
    }
  };
};

const makeSet = (stateName: string) => {
  return (state: any, payload: ObjectSetPayload) => {
    if (!isValidPath(state[stateName], payload.key)) {
      throw new Error(`${payload.key} is not valid path.`);
    }
    deepSet(state[stateName], payload.key, payload.value);
  };
};

const makeReset = (stateName: string, initialState: any) => {
  return (state: any) => {
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

const makeAssign = (stateName: string) => {
  return (state: any, payload: any) => (state[stateName] = payload);
};

function build(initialState: any): MutationTree<any> {
  return Object.keys(initialState).reduce(
    (acc: any, stateName: string) => {
      if (Array.isArray(initialState[stateName])) {
        acc[`${stateName}$add`] = makeAdd(stateName);
        acc[`${stateName}$delete`] = makeDelete(stateName);
        acc[`${stateName}$update`] = makeUpdate(stateName);
      } else if (initialState[stateName] instanceof Object) {
        acc[`${stateName}$set`] = makeSet(stateName);
      }
      acc[`${stateName}$assign`] = makeAssign(stateName);
      acc[`${stateName}$reset`] = makeReset(stateName, initialState);
      return acc;
    },
    {
      $resetAll: makeResetAll(initialState)
    }
  );
}

export default build;
