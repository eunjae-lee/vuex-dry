import { ActionTree, ActionContext } from "vuex";
import BuildConfig from "./build_config";

const makeAssign = (stateName: string) => {
  return (context: ActionContext<any, any>, payload: any) =>
    context.commit(`${stateName}$assign`, payload);
};

const makeReset = (stateName: string) => {
  return (context: ActionContext<any, any>) =>
    context.commit(`${stateName}$reset`);
};

const makeResetAll = () => {
  return (context: ActionContext<any, any>) => context.commit("$resetAll");
};

function build(buildConfig: BuildConfig): ActionTree<any, any> {
  const initialState = buildConfig.state();
  return Object.keys(initialState).reduce(
    (acc: any, stateName: string, index: number) => {
      acc[`${stateName}$assign`] = makeAssign(stateName);
      acc[`${stateName}$reset`] = makeReset(stateName);
      return acc;
    },
    {
      $resetAll: makeResetAll()
    }
  );
}

export default build;
