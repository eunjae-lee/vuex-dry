import ModuleBuildConfig from "./build_config";
import { Getter, GetterTree } from "vuex";

function getter(key: string): Getter<any, any> {
  return (state: any) => state[key];
}

function build(buildConfig: ModuleBuildConfig): GetterTree<any, any> {
  return Object.keys(buildConfig.data()).reduce(
    (acc: any, key: string, index: number) => {
      acc[key] = getter(key);
      return acc;
    },
    {}
  );
}

export default build;
