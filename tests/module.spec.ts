import { Module } from "../lib";

describe("Module", () => {
  it("has build()", () => {
    expect(Module.build).toBeInstanceOf(Function);
  });

  it("builds a simple module", () => {
    const module = Module.build({
      name: "auth",
      data() {
        return {
          token: undefined
        };
      }
    });
    expect(module).toEqual({
      namespaced: true,
      state: {
        token: undefined
      },
      getters: {},
      actions: {},
      mutations: {}
    });
  });
});
