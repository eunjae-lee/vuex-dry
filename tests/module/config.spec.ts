import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleStore = () => {
  return new Vuex.Store({
    modules: {
      user: Module.build({
        config: {
          nonStrictObject: ["profile"]
        },
        state() {
          return {
            profile: {}
          };
        }
      })
    }
  });
};

describe("Config", () => {
  describe("nonStrictObject", () => {
    it("allows dynamic path by default for $set", () => {
      const store = sampleStore();
      expect(function() {
        store.commit("user/profile$set", { key: "bio", value: "Hello" });
      }).not.toThrowError();
    });

    it("allows dynamic path by default for $get", () => {
      const store = sampleStore();
      store.commit("user/profile$set", { key: "bio", value: "Hello" });
      expect(store.getters["user/profile$get"]("bio")).toEqual("Hello");
    });
  });
});
