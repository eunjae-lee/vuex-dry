import { Module as VuexModule } from "vuex";

interface ModuleBuildConfig {
  name: string;
  data: Function;
  modules?: ModuleTree;
}

interface ModuleTree {
  [key: string]: VuexModule;
}

export default ModuleBuildConfig;
