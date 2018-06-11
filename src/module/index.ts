import BuildConfig from "./build_config";
import buildState from "./state_builder";
import buildGetters from "./getters_builder";
import buildMutations from "./mutations_builder";
import buildActions from "./actions_builder";
import modifierGetters from "./modifier_getters";
import modifierMutations from "./modifier_mutations";
import { Module as VuexModuleType } from "vuex";

const Module = {
  build(buildConfig: BuildConfig): VuexModuleType<any, any> {
    const initialState = buildConfig.state();
    return {
      namespaced: true,
      state: buildState(buildConfig),
      getters: {
        ...modifierGetters(initialState),
        ...buildGetters(initialState),
        ...buildConfig.getters
      },
      mutations: {
        ...modifierMutations(initialState),
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
