import { Module } from "../../lib";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

function sampleStore() {
  return new Vuex.Store({
    modules: {
      user: Module.build({
        name: "user",
        data() {
          return {
            myList: [],
            myMap: {}
          };
        }
      })
    }
  });
}

describe("Default mutations", () => {
  it("provide $add for array state", () => {
    const store = sampleStore();
    store.commit("user/$add", { key: "myList", value: "abc" });
    expect(store.getters["user/myList"]).toEqual(["abc"]);
  });
});
