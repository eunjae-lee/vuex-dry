import ModuleBuildConfig from "./build_config";

function build(buildConfig: ModuleBuildConfig) {
  return buildConfig.data();
}

export default build;
