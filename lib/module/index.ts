import BuildConfig from "./build_config";
import buildState from "./state_builder";
import buildGetters from "./getters_builder";
import buildMutations from "./mutations_builder";
import buildActions from "./actions_builder";

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
