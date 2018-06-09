import {
  Module as VuexModule,
  GetterTree,
  ActionTree,
  MutationTree
} from "vuex";

interface ModuleBuildConfig {
  name: string;
  data: Function;
  getters?: GetterTree<any, any>;
  actions?: ActionTree<any, any>;
  mutations?: MutationTree<any>;
}

export default ModuleBuildConfig;
