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
        bio: get("user/meta", "profile.bio")
      }
    };
    const wrapper = shallowMount(comp);
    store.commit("user/meta$set", { key: "profile.bio", value: "world" });
    expect(wrapper.find("p").text()).toEqual("world");
  });
});
