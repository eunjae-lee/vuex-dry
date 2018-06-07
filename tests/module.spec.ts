import { Module } from "../lib";

describe("Module", () => {
  it("has build()", () => {
    expect(Module.build).toBeInstanceOf(Function);
  });

  it("builds state", () => {
    const module = Module.build({
      name: "auth",
      data() {
        return {
          token: "my token"
        };
      }
    });
    expect(module.state.token).toEqual("my token");
  });

  it("builds getters", () => {
    const module = Module.build({
      name: "auth",
      data() {
        return {
          token: "my token"
        };
      }
    });
    expect(module.getters.token(module.state)).toEqual("my token");
    // TODO : change the above line with the way using vuex store. The getters shouldn't be used this way.
  });
});
