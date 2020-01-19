import BuildConfig from "./build_config";
import buildState from "./state_builder";
import buildGetters from "./getters_builder";
import buildMutations from "./mutations_builder";
import buildActions from "./actions_builder";
import { Module as VuexModuleType } from "vuex";

const Module = {
  build(buildConfig: BuildConfig): VuexModuleType<any, any> {
    const { stateAsFunction } = buildConfig;
    const state = buildState(buildConfig);
    return {
      namespaced: true,
      state: stateAsFunction ? () => state : state,
      getters: {
        ...buildGetters(buildConfig),
        ...buildConfig.getters
      },
      mutations: {
        ...buildMutations(buildConfig),
        ...buildConfig.mutations
      },
      actions: {
        ...buildActions(buildConfig),
        ...buildConfig.actions
      },
      modules: buildConfig.modules
    };
  }
};

export default Module;
