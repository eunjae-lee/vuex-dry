import BuildConfig from "./build_config";
import { Module as VuexModuleType } from "vuex";
declare const Module: {
    build(buildConfig: BuildConfig): VuexModuleType<any, any>;
};
export default Module;
