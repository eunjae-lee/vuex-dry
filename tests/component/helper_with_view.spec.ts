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
const sampleStore3 = () => {
  const module = Module.build({
    state() {
      return {
        list: []
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

  it("get() value with props", () => {
    const comp = {
      template: "<p>{{ bio }}</p>",
      store: sampleStore(),
      props: ["usermeta"],
      computed: {
        bio: get({ this: "usermeta" }, "profile.bio")
      }
    };
    const wrapper = shallowMount(comp, {
      propsData: {
        usermeta: "user/meta"
      }
    });
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

  it("sync() with props", () => {
    const store = sampleStore2();
    const comp = {
      template: "<p>{{ username }}</p>",
      props: ["stateName", "nestedPath"],
      store,
      computed: {
        username: sync({ this: "stateName" }, { this: "nestedPath" })
      }
    };
    const wrapper = shallowMount(comp, {
      propsData: {
        stateName: "user/meta",
        nestedPath: "twitter.username"
      }
    });
    expect(wrapper.find("p").text()).toEqual("");
    store.commit("user/meta$set", { key: "twitter.username", value: "abc" });
    wrapper.vm.$forceUpdate();
    expect(wrapper.find("p").text()).toEqual("abc");
  });

  it("sync() with data", () => {
    const store = sampleStore2();
    const comp = {
      template: "<p>{{ username }}</p>",
      store,
      computed: {
        username: sync({ this: "stateName" }, { this: "nestedPath" })
      },
      data() {
        return {
          stateName: "user/meta",
          nestedPath: "twitter.username"
        };
      }
    };
    const wrapper = shallowMount(comp);
    expect(wrapper.find("p").text()).toEqual("");
    store.commit("user/meta$set", { key: "twitter.username", value: "abc" });
    wrapper.vm.$forceUpdate();
    expect(wrapper.find("p").text()).toEqual("abc");
  });

  it("sync() with computed", () => {
    const store = sampleStore2();
    const comp = {
      template: "<p>{{ username }}</p>",
      store,
      computed: {
        username: sync({ this: "stateName" }, { this: "nestedPath" }),
        stateName() {
          return "user/meta";
        },
        nestedPath() {
          return "twitter.username";
        }
      }
    };
    const wrapper = shallowMount(comp);
    expect(wrapper.find("p").text()).toEqual("");
    store.commit("user/meta$set", { key: "twitter.username", value: "abc" });
    wrapper.vm.$forceUpdate();
    expect(wrapper.find("p").text()).toEqual("abc");
  });

  it("sync() with mixed", () => {
    const store = sampleStore2();
    const comp = {
      template: "<p>{{ username }}</p>",
      store,
      computed: {
        username: sync({ this: "stateName" }, { this: "nestedPath" }),
        stateName() {
          return this.user + "/" + this.meta;
        },
        nestedPath() {
          return this.twitter + ".username";
        }
      },
      props: ["user"],
      data() {
        return {
          meta: "meta",
          twitter: "twitter"
        };
      }
    };
    const wrapper = shallowMount(comp, {
      propsData: {
        user: "user"
      }
    });
    expect(wrapper.find("p").text()).toEqual("");
    store.commit("user/meta$set", { key: "twitter.username", value: "abc" });
    wrapper.vm.$forceUpdate();
    expect(wrapper.find("p").text()).toEqual("abc");
  });

  it("works with list", () => {
    const store = sampleStore3();
    const comp = {
      template: `
        <div>
          <p v-for="item in list">{{ item.name }}</p>
        </div>
      `,
      store,
      computed: {
        list: sync("user/list")
      }
    };
    const wrapper = shallowMount(comp);
    expect(wrapper.findAll("p").exists()).toBe(false);

    store.commit("user/list$add", { id: 1, name: "first" });
    expect(wrapper.find("p").text()).toBe("first");
    store.commit("user/list$add", { id: 2, name: "second" });
    store.commit("user/list$update", {
      value: { id: 2, name: "modified_second" },
      test: "id"
    });
    expect(
      wrapper
        .findAll("p")
        .at(1)
        .text()
    ).toBe("modified_second");
  });

  it("action() resets value from store", () => {
    const comp = {
      template: "<p>{{ bio }}</p>",
      store: sampleStore(),
      computed: {
        bio: sync("user/meta", "profile.bio")
      },
      methods: {
        resetAll: action("user/meta$reset")
      },
      created() {
        this.bio = "hello2";
        this.resetAll();
      }
    };
    const wrapper = shallowMount(comp);

    expect(wrapper.find("p").text()).toEqual("hello");
  });

  it("action() resets value with data from store", () => {
    const comp = {
      template: "<p>{{ bio }}</p>",
      store: sampleStore(),
      computed: {
        bio: sync("user/meta", "profile.bio")
      },
      data() {
        return {
          actionType: "user/meta$reset"
        };
      },
      methods: {
        resetAll: action({ this: "actionType" })
      },
      created() {
        this.bio = "hello2";
        this.resetAll();
      }
    };
    const wrapper = shallowMount(comp);

    expect(wrapper.find("p").text()).toEqual("hello");
  });
});
