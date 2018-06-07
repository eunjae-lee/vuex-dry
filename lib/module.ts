import BuildConfig from "./module/build_config";
import buildState from "./module/state_builder";
import buildGetters from "./module/getters_builder";
import buildMutations from "./module/mutations_builder";
import buildActions from "./module/actions_builder";

const Module = {
  build(buildConfig: BuildConfig) {
    return {
      namespaced: true,
      state: buildState(buildConfig),
      getters: buildGetters(buildConfig),
      actions: buildActions(buildConfig),
      mutations: buildMutations(buildConfig)
    };
  }
};

export default Module;
