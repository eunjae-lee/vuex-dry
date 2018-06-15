import { plugin, Module } from "../../src";
import Vuex from "vuex";
import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
Vue.use(Vuex);
import { get, action, sync } from "../../src/component/helper";

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
    plugins: [plugin],
    modules: { user: sampleModule() }
  });
};

const sampleStore2 = () => {
  const module = Module.build({
    config: {
      nonStrictObject: ["meta"]
    },
    state() {
      return {
        meta: {}
      };
    }
  });
  return new Vuex.Store({
    plugins: [plugin],
    modules: { user: module }
  });
};

describe("View Test", () => {
  it("renders a simple component", () => {
    const comp = {
      template: "<p>{{ message }}</p>",
      data() {
        return {
          message: "hello"
        };
      }
    };
    const wrapper = shallowMount(comp, {
      data() {
        return {
          message: "world"
        };
      }
    });
    expect(wrapper.find("p").text()).toEqual("world");
  });

  it("get() value from store", () => {
    const comp = {
      template: "<p>{{ bio }}</p>",
      store: sampleStore(),
      computed: {
        bio: get("user/meta", "profile.bio")
      }
    };
    const wrapper = shallowMount(comp);
    expect(wrapper.find("p").text()).toEqual("hello");
  });

  it("sync() value from store", () => {
    const store = sampleStore();
    const comp = {
      template: "<p>{{ bio }}</p>",
      store,
      computed: {
        bio: sync("user/meta", "profile.bio")
      }
    };
    const wrapper = shallowMount(comp);
    expect(wrapper.find("p").text()).toEqual("hello");
    store.commit("user/meta$set", { key: "profile.bio", value: "world" });
    expect(wrapper.find("p").text()).toEqual("world");
  });

  it("sync() value from store with nonStrictObject", () => {
    const store = sampleStore2();
    const comp = {
      template: "<p>{{ username }}</p>",
      store,
      computed: {
        username: sync("user/meta", "twitter.username")
      }
    };
    const wrapper = shallowMount(comp);
    expect(wrapper.find("p").text()).toEqual("");
    store.commit("user/meta$set", { key: "twitter.username", value: "abc" });
    wrapper.vm.$forceUpdate();
    expect(wrapper.find("p").text()).toEqual("abc");
  });
});
