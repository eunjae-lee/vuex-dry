import { ActionTree } from "vuex";
import BuildConfig from "./build_config";
declare function build(buildConfig: BuildConfig): ActionTree<any, any>;
export default build;
