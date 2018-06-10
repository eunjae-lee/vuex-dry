import { Getter, GetterTree } from "vuex";

function getter(key: string): Getter<any, any> {
  return (state: any) => state[key];
}

function build(initialState: any): GetterTree<any, any> {
  return Object.keys(initialState).reduce(
    (acc: any, key: string, index: number) => {
      acc[key] = getter(key);
      return acc;
    },
    {}
  );
}

export default build;
