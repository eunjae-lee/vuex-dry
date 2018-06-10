import { Module } from "../../lib";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleStore = () => {
  return new Vuex.Store({
    modules: {
      user: Module.build({
        name: "user",
        data() {
          return {
            profile: {
              bio: "hello"
            }
          };
        }
      })
    }
  });
};

describe("Default getters", () => {
  it("provide $get for object state", () => {
    const store = sampleStore();
    expect(store.getters["user/$get"]("profile.bio")).toEqual("hello");
  });

  it("throws error when queried with wrong path", () => {
    const store = sampleStore();
    expect(() => {
      store.getters["user/$get"]("profile.bioo");
    }).toThrow();
  });
});
