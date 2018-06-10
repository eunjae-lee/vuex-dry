import ModuleBuildConfig from "./build_config";
import { Action, ActionTree, ActionContext } from "vuex";
import { capitalize } from "../utils/string_util";

function actionName(key: string) {
  return `set${capitalize(key)}`;
}

function mutationName(key: string) {
  return actionName(key);
}

function action(key: string): Action<any, any> {
  return (context: ActionContext<any, any>, payload: any) =>
    context.commit(mutationName(key), payload);
}

function build(buildConfig: ModuleBuildConfig): ActionTree<any, any> {
  return Object.keys(buildConfig.data()).reduce(
    (acc: any, key: string, index: number) => {
      acc[actionName(key)] = action(key);
      return acc;
    },
    {}
  );
}

export default build;
