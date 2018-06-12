import {
  Module as VuexModule,
  GetterTree,
  ActionTree,
  MutationTree,
  ModuleTree
} from "vuex";

interface BuildConfig {
  state: Function;
  getters?: GetterTree<any, any>;
  actions?: ActionTree<any, any>;
  mutations?: MutationTree<any>;
  modules?: ModuleTree<any>;
}

export default BuildConfig;
