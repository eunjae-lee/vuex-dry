import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

const sampleStore = () => {
  return new Vuex.Store({
    modules: {
      user: Module.build({
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

  it("provide `strict: false` for $get", () => {
    const store = sampleStore();
    expect(
      store.getters["user/profile$get"]({ key: "bio", strict: false })
    ).toEqual("hello");
  });

  it("provide `strict: false` for $get (2)", () => {
    const store = sampleStore();
    store.commit("user/profile$set", {
      key: "twitter",
      value: "abc",
      strict: false
    });
    expect(
      store.getters["user/profile$get"]({ key: "twitter", strict: false })
    ).toEqual("abc");
  });

  it("provide `strict: false` for $get (3)", () => {
    const store = sampleStore();
    store.commit("user/profile$set", {
      key: "twitter",
      value: "abc",
      strict: false
    });
    expect(function() {
      store.getters["user/profile$get"]({ key: "twitter" });
    }).toThrowError();
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
