import { Module } from "../../lib";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleModule = () => {
  return Module.build({
    name: "user",
    data() {
      return {
        name: "Paul"
      };
    }
  });
};

const sampleStore = () => {
  return new Vuex.Store({
    modules: { user: sampleModule() }
  });
};

describe("Module", () => {
  it("has build()", () => {
    expect(Module.build).toBeInstanceOf(Function);
  });

  it("builds state", () => {
    const store = sampleStore();
    expect((store.state as any).user.name).toEqual("Paul");
  });

  it("builds getters", () => {
    const store = sampleStore();
    expect(store.getters["user/name"]).toEqual("Paul");
  });

  it("builds mutations", () => {
    const store = sampleStore();
    store.commit("user/setName", "Eunjae");
    expect((store.state as any).user.name).toEqual("Eunjae");
    expect(store.getters["user/name"]).toEqual("Eunjae");
  });

  it("builds actions", () => {
    const store = sampleStore();
    store.dispatch("user/setName", "Eunjae");
    expect((store.state as any).user.name).toEqual("Eunjae");
    expect(store.getters["user/name"]).toEqual("Eunjae");
  });
});
