import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleStore = () => {
  return new Vuex.Store({
    modules: {
      user: Module.build({
        name: "user",
        state() {
          return {
            profile: {
              bio: "hello"
            },
            posts: []
          };
        }
      })
    }
  });
};

describe("Default getters", () => {
  it("provide $get for object state", () => {
    const store = sampleStore();
    expect(store.getters["user/profile$get"]("bio")).toEqual("hello");
  });

  it("throws error when queried with wrong path", () => {
    const store = sampleStore();
    expect(() => {
      store.getters["user/profile$get"]("bioo");
    }).toThrow();
  });

  it("provide $find for array state", () => {
    const store = sampleStore();
    store.commit("user/posts$add", { id: 1, title: "hello" });
    store.commit("user/posts$add", { id: 2, title: "world" });
    store.commit("user/posts$add", { id: 3, title: "!" });
    expect(
      store.getters["user/posts$find"]((item: any) => item.id == 2)
    ).toEqual({ id: 2, title: "world" });
  });

  it("provide $filter for array state", () => {
    const store = sampleStore();
    store.commit("user/posts$add", { id: 1, title: "hello" });
    store.commit("user/posts$add", { id: 2, title: "world" });
    store.commit("user/posts$add", { id: 3, title: "!" });
    expect(
      store.getters["user/posts$filter"]((item: any) => item.id > 1)
    ).toEqual([{ id: 2, title: "world" }, { id: 3, title: "!" }]);
  });
});
