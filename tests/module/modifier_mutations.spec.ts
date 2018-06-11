import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

function sampleStore() {
  return new Vuex.Store({
    modules: {
      user: Module.build({
        name: "user",
        state() {
          return {
            myList: [],
            myMap: {
              abc: undefined
            }
          };
        }
      })
    }
  });
}

describe("Default mutations", () => {
  it("provide $add for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", "abc");
    expect(store.getters["user/myList"]).toEqual(["abc"]);
  });
  it("provide $delete for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$delete", (x: any) => x.id == 1);
    expect(store.getters["user/myList"]).toEqual([{ id: 2, name: "John" }]);
  });
  it("provide $update for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$update", {
      value: { id: 1, name: "Paul Lee" },
      identifier: (x: any) => x.id == 1
    });
    expect(store.getters["user/myList"]).toEqual([
      { id: 1, name: "Paul Lee" },
      { id: 2, name: "John" }
    ]);
  });

  it("allows string parameter as identifier for $update", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$update", {
      value: { id: 1, name: "Paul Lee" },
      identifier: "id"
    });
    expect(store.getters["user/myList"]).toEqual([
      { id: 1, name: "Paul Lee" },
      { id: 2, name: "John" }
    ]);
  });

  it("add item when $update failed to find one", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$update", {
      value: { id: 3, name: "Tom" },
      identifier: "id"
    });
    expect(store.getters["user/myList"]).toEqual([
      { id: 1, name: "Paul" },
      { id: 2, name: "John" },
      { id: 3, name: "Tom" }
    ]);
  });

  it("provide $set for object state", () => {
    const store = sampleStore();
    store.commit("user/myMap$set", { key: "abc", value: "def" });
    expect(store.getters["user/myMap"]).toEqual({ abc: "def" });
  });

  it("fails to $set when path is wrong", () => {
    const store = sampleStore();
    expect(() => {
      store.commit("user/myMap$set", { key: "abc2", value: "def" });
    }).toThrow();
  });

  it("`$set`s nested property", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          name: "user",
          state() {
            return {
              user: {
                profile: {
                  bio: undefined
                }
              }
            };
          }
        })
      }
    });
    store.commit("user/user$set", { key: "profile.bio", value: "hello" });
    expect(store.getters["user/user"]).toEqual({ profile: { bio: "hello" } });
  });

  it("provide $reset", () => {
    const store = sampleStore();
    store.commit("user/myList$add", "hello");
    store.commit("user/myList$reset");
    expect(store.getters["user/myList"]).toEqual([]);
  });

  it("provide $resetAll", () => {
    const store = sampleStore();
    store.commit("user/myList$add", "hello");
    store.commit("user/myMap$set", { key: "abc", value: "def" });
    store.commit("user/$resetAll");
    expect(store.getters["user/myList"]).toEqual([]);
    expect(store.getters["user/myMap"]).toEqual({});
  });
});
