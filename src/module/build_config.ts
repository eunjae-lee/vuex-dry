import {
  Module as VuexModule,
  GetterTree,
  ActionTree,
  MutationTree
} from "vuex";

interface BuildConfig {
  name: string;
  state: Function;
  getters?: GetterTree<any, any>;
  actions?: ActionTree<any, any>;
  mutations?: MutationTree<any>;
}

export default BuildConfig;
