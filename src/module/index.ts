import BuildConfig from "./build_config";
import buildState from "./state_builder";
import buildGetters from "./getters_builder";
import buildMutations from "./mutations_builder";
import buildActions from "./actions_builder";
import defaultGetters from "./default_getters";
import defaultMutations from "./default_mutations";
import { Module as VuexModuleType } from "vuex";

const Module = {
  build(buildConfig: BuildConfig): VuexModuleType<any, any> {
    const initialState = buildConfig.state();
    return {
      namespaced: true,
      state: buildState(buildConfig),
      getters: {
        ...defaultGetters(initialState),
        ...buildGetters(initialState),
        ...buildConfig.getters
      },
      mutations: {
        ...defaultMutations(initialState),
        ...buildMutations(initialState),
        ...buildConfig.mutations
      },
      actions: {
        ...buildActions(initialState),
        ...buildConfig.actions
      }
    };
  }
};

export default Module;
