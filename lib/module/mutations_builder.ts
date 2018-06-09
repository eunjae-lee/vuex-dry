import ModuleBuildConfig from "./build_config";
import { Mutation, MutationTree } from "vuex";
import { capitalize } from "../utils/string_util";

function mutationName(key: string) {
  return `set${capitalize(key)}`;
}

function mutation(key: string): Mutation<any> {
  return (state: any, payload: any) => (state[key] = payload);
}

function build(buildConfig: ModuleBuildConfig): MutationTree<any> {
  return Object.keys(buildConfig.data()).reduce(
    (acc: any, key: string, index: number) => {
      acc[mutationName(key)] = mutation(key);
      return acc;
    },
    {}
  );
}

export default build;
