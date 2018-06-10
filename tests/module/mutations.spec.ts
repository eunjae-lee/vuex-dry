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
    store.commit("user/$add", { state: "myList", value: "abc" });
    expect(store.getters["user/myList"]).toEqual(["abc"]);
  });
  it("provide $delete for array state", () => {
    const store = sampleStore();
    store.commit("user/$add", {
      state: "myList",
      value: { id: 1, name: "Paul" }
    });
    store.commit("user/$add", {
      state: "myList",
      value: { id: 2, name: "John" }
    });
    store.commit("user/$delete", {
      state: "myList",
      identifier: (x: any) => x.id == 1
    });
    expect(store.getters["user/myList"]).toEqual([{ id: 2, name: "John" }]);
  });
  it("provide $update for array state", () => {
    const store = sampleStore();
    store.commit("user/$add", {
      state: "myList",
      value: { id: 1, name: "Paul" }
    });
    store.commit("user/$add", {
      state: "myList",
      value: { id: 2, name: "John" }
    });
    store.commit("user/$update", {
      state: "myList",
      value: { id: 1, name: "Paul Lee" },
      identifier: (x: any) => x.id == 1
    });
    expect(store.getters["user/myList"]).toEqual([
      { id: 1, name: "Paul Lee" },
      { id: 2, name: "John" }
    ]);
  });
  it("add item when $update failed to find one", () => {
    const store = sampleStore();
    store.commit("user/$add", {
      state: "myList",
      value: { id: 1, name: "Paul" }
    });
    store.commit("user/$add", {
      state: "myList",
      value: { id: 2, name: "John" }
    });
    store.commit("user/$update", {
      state: "myList",
      value: { id: 3, name: "Tom" },
      identifier: (x: any) => x.id == 3
    });
    expect(store.getters["user/myList"]).toEqual([
      { id: 1, name: "Paul" },
      { id: 2, name: "John" },
      { id: 3, name: "Tom" }
    ]);
  });

  it("provide $set for object state", () => {
    const store = sampleStore();
    store.commit("user/$set", { state: "myMap", key: "abc", value: "def" });
    expect(store.getters["user/myMap"]).toEqual({ abc: "def" });
  });
});
