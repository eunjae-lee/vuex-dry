import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleStore = () => {
  const owner = Module.build({
    state() {
      return {
        name: "owner name",
        profile: {
          bio: "hello"
        }
      };
    }
  });

  const company = Module.build({
    state() {
      return {
        name: "my company"
      };
    },
    modules: {
      owner
    }
  });

  return new Vuex.Store({
    modules: {
      company
    }
  });
};

describe("Nested module", () => {
  it("works fine", () => {
    const store = sampleStore();
    store.commit("company/owner/name$assign", "Paul");
    expect(store.getters["company/owner/name"]).toEqual("Paul");
  });

  it("works fine with $set", () => {
    const store = sampleStore();
    store.commit("company/owner/profile$set", { key: "bio", value: "world" });
    expect(store.getters["company/owner/profile$get"]("bio")).toEqual("world");
  });
});