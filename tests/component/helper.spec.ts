import { Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
import cachedStore from "../../src/component/cached_store";
Vue.use(Vuex);
import { get, action, sync, $get, $action } from "../../src/component/helper";

const sampleModule = () => {
  return Module.build({
    state() {
      return {
        name: "Paul",
        meta: {
          profile: {
            bio: "hello"
          }
        }
      };
    }
  });
};

const sampleStore = () => {
  return new Vuex.Store({
    modules: { user: sampleModule() }
  });
};

describe("Component Helper", () => {
  beforeEach(() => {
    cachedStore.set(undefined);
  });

  it("get()", () => {
    const store = sampleStore();
    cachedStore.set(store);

    expect($get("user/name")).toEqual("Paul");
  });

  it("action()", () => {
    const store = sampleStore();
    cachedStore.set(store);

    $action("user/name$assign", "Eunjae");
    expect($get("user/name")).toEqual("Eunjae");
  });

  it("sync()", () => {
    const store = sampleStore();
    cachedStore.set(store);

    const property = sync("user/name");
    property.set("Eunjae");
    expect($get("user/name")).toEqual("Eunjae");

    property.set("John");
    expect(property.get()).toEqual("John");
  });

  it("get() with nested path", () => {
    const store = sampleStore();
    cachedStore.set(store);

    expect($get("user/meta", "profile.bio")).toEqual("hello");
  });

  it("sync() with nested path", () => {
    const store = sampleStore();
    cachedStore.set(store);

    const property = sync("user/meta", "profile.bio");
    expect(property.get()).toEqual("hello");
    property.set("world");
    expect($get("user/meta")).toEqual({ profile: { bio: "world" } });
  });
});
