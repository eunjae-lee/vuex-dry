import { Module } from "../../src";
import { muteLog } from "../../src/utils/logger";
import Vuex from "vuex";
import Vue from "vue";
Vue.use(Vuex);

function sampleStore() {
  return new Vuex.Store({
    modules: {
      user: Module.build({
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
  beforeEach(() => muteLog());

  it("provide $add for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", "abc");
    expect(store.getters["user/myList"]).toEqual(["abc"]);
  });
  it("provide $unshift for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", "def");
    store.commit("user/myList$unshift", "abc");
    expect(store.getters["user/myList"]).toEqual(["abc", "def"]);
  });
  it("provide $delete for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$delete", (x: any) => x.id == 1);
    expect(store.getters["user/myList"]).toEqual([{ id: 2, name: "John" }]);
  });
  it("provide $delete for array state with key, value", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$delete", ["id", 1]);
    expect(store.getters["user/myList"]).toEqual([{ id: 2, name: "John" }]);
  });
  it("provide $update for array state", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$update", {
      value: { id: 1, name: "Paul Lee" },
      test: (x: any) => x.id == 1
    });
    expect(store.getters["user/myList"]).toEqual([
      { id: 1, name: "Paul Lee" },
      { id: 2, name: "John" }
    ]);
  });

  it("allows string parameter as test for $update", () => {
    const store = sampleStore();
    store.commit("user/myList$add", { id: 1, name: "Paul" });
    store.commit("user/myList$add", { id: 2, name: "John" });
    store.commit("user/myList$update", {
      value: { id: 1, name: "Paul Lee" },
      test: "id"
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
      test: "id"
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

  it("`$set`s a property with strict: false", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          state() {
            return {
              user: {}
            };
          }
        })
      }
    });
    store.commit("user/user$set", {
      key: "name",
      value: "Paul",
      strict: false
    });
    expect(store.getters["user/user"]).toEqual({ name: "Paul" });
  });

  it("`$set`s nested property with strict: false", () => {
    const store = new Vuex.Store({
      modules: {
        user: Module.build({
          state() {
            return {
              user: {}
            };
          }
        })
      }
    });
    store.commit("user/user$set", {
      key: "profile.bio",
      value: "hello",
      strict: false
    });
    expect(store.getters["user/user"]).toEqual({ profile: { bio: "hello" } });
  });

  it("`$set`s nested properties several times with strict: false", () => {
    const store = new Vuex.Store({
      modules: {
        myModule: Module.build({
          state() {
            return {
              user: {}
            };
          }
        })
      }
    });
    store.commit("myModule/user$set", {
      key: "profile.bio",
      value: "hello",
      strict: false
    });
    store.commit("myModule/user$set", {
      key: "profile.bio2",
      value: "hello2",
      strict: false
    });
    store.commit("myModule/user$set", {
      key: "profile.bio3",
      value: "hello3",
      strict: false
    });
    expect(store.getters["myModule/user"]).toEqual({
      profile: { bio: "hello", bio2: "hello2", bio3: "hello3" }
    });
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
