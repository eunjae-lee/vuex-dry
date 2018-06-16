import { MutationTree } from "vuex";
import BuildConfig from "./build_config";
declare function build(buildConfig: BuildConfig): MutationTree<any>;
export default build;
