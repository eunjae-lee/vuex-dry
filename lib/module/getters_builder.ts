import ModuleBuildConfig from "./build_config";
import { GetterTree } from "vuex";

function build(buildConfig: ModuleBuildConfig): any {
  return Object.keys(buildConfig.data()).reduce(
    (acc: any, key: string, index: number) => {
      acc[key] = (state: any) => state[key];
      return acc;
    },
    {}
  );
}

export default build;
