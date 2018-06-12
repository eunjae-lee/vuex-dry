import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleModule = () => {
  return Module.build({
    state() {
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
    expect(store.state.user.name).toEqual("Paul");
  });

  it("builds getters", () => {
    const store = sampleStore();
    expect(store.getters["user/name"]).toEqual("Paul");
  });

  it("builds mutations", () => {
    const store = sampleStore();
    store.commit("user/name$assign", "John");
    expect(store.state.user.name).toEqual("John");
    expect(store.getters["user/name"]).toEqual("John");
  });

  it("builds actions", () => {
    const store = sampleStore();
    store.dispatch("user/name$assign", "John");
    expect(store.state.user.name).toEqual("John");
    expect(store.getters["user/name"]).toEqual("John");
  });

  it("adds `$reset` to mutations", () => {
    const store = sampleStore();
    store.dispatch("user/name$assign", "John");
    store.commit("user/name$reset");
    expect(store.getters["user/name"]).toEqual("Paul");
  });

  it("adds `$reset` to actions", async () => {
    const store = sampleStore();
    await store.dispatch("user/name$assign", "John");
    await store.dispatch("user/name$reset");
    expect(store.getters["user/name"]).toEqual("Paul");
  });

  it("let us add getters", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          state() {
            return {
              name: "Paul"
            };
          },
          getters: {
            upperCaseName: state => state.name.toUpperCase()
          }
        })
      }
    });
    expect(store.getters["user/upperCaseName"]).toEqual("PAUL");
  });

  it("let us add mutations", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          state() {
            return {
              name: "Paul"
            };
          },
          mutations: {
            doubleName: state => (state.name = state.name.repeat(2))
          }
        })
      }
    });
    store.commit("user/doubleName");
    expect(store.getters["user/name"]).toEqual("PaulPaul");
  });

  it("let us add actions", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          state() {
            return {
              name: "Paul"
            };
          },
          actions: {
            customNameSetter: ({ commit }, newName: string) =>
              commit("name$assign", newName)
          }
        })
      }
    });
    store.dispatch("user/customNameSetter", "John");
    expect(store.getters["user/name"]).toEqual("John");
  });
});
