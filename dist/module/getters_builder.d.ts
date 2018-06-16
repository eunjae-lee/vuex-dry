import { GetterTree } from "vuex";
import BuildConfig from "./build_config";
declare function build(buildConfig: BuildConfig): GetterTree<any, any>;
export default build;
