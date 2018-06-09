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
    expect(store.state.user.name).toEqual("Paul");
  });

  it("builds getters", () => {
    const store = sampleStore();
    expect(store.getters["user/name"]).toEqual("Paul");
  });

  it("builds mutations", () => {
    const store = sampleStore();
    store.commit("user/setName", "Eunjae");
    expect(store.state.user.name).toEqual("Eunjae");
    expect(store.getters["user/name"]).toEqual("Eunjae");
  });

  it("builds actions", () => {
    const store = sampleStore();
    store.dispatch("user/setName", "Eunjae");
    expect(store.state.user.name).toEqual("Eunjae");
    expect(store.getters["user/name"]).toEqual("Eunjae");
  });

  it("let us add getters", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          name: "user",
          data() {
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
          name: "user",
          data() {
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
          name: "user",
          data() {
            return {
              name: "Paul"
            };
          },
          actions: {
            customNameSetter: ({ commit }, newName: string) =>
              commit("setName", newName)
          }
        })
      }
    });
    store.dispatch("user/customNameSetter", "Eunjae");
    expect(store.getters["user/name"]).toEqual("Eunjae");
  });
});
