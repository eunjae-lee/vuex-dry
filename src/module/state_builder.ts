import ModuleBuildConfig from "./build_config";

function build(buildConfig: ModuleBuildConfig) {
  return buildConfig.state();
}

export default build;
