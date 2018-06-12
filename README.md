# Introduction

`vuex-dry` helps keep your vuex code DRY.
It doesn't introduce any whole new way to use vuex.
It just helps build modules for you with a minimum amount of code, adding some convenient getters, mutations, and actions.

`vuex-dry` is TypeScript-friendly since it's written in TypeScript.

# Install

```bash
npm i vuex-dry -S
```

Add the plugin to your vuex store.

```js
import { plugin } from "vuex-dry";

new Vuex.Store({
  plugins: [plugin],
  ...
});
```

# Getting Started

## Simple Module

```js
import { Module } from "vuex-dry";

const user = Module.build({
  state() {
    return {
      name: undefined
    };
  }
});

const store = new Vuex.Store({
  modules: {
    user
  }
});
```

That's it. At `Module.build()`, we put a function named `state` returning an object. This object will be used as an initial state and also used when you want to reset a specific state or even whole state. We'll see how to reset things later.

Let's look at the module building part again.

```js
Module.build({
  state() {
    return {
      name: undefined
    };
  }
});
```

The code above is effectively same as the following:

```js
{
  namespaced: true,
  state {
    name: undefined
  },
  getters: {
    name: state => state.name
  },
  mutations: {
    name$assign(state, value) {
      state.name = value;
    },
    name$reset(state) {
      state.name = undefined;
    },
    $resetAll(state) {
      state.name = undefined;
      // also resetting other states if exists
    }
  },
  actions: {
    name$assign({ commit }, value) {
      commit("name$assign", value);
    },
    name$reset({ commit }) {
      commit("name$reset");
    },
    $resetAll({ commit }) {
      commit("$resetAll");
    }
  }
})
```

You see what has been done here?

The followings are added to your module:

- A getter `name`
- A mutation and an action `name$assign` to set a value to the state `name`.
- A mutation and an action `name$reset` to reset the state `name`.
- A mutation and an action `$resetAll` to reset all states from the module.

These are always repeated every time we write vuex code. And now you don't need them anymore.

## More things to read,

- [Adding your own getters, mutations and actions](https://github.com/eunjae-lee/vuex-dry/wiki/Adding-your-own-getters,-mutations-and-actions)
- [Module with Array state](https://github.com/eunjae-lee/vuex-dry/wiki/Module-with-Array-state)
- [Module with Object state](https://github.com/eunjae-lee/vuex-dry/wiki/Module-with-Object-state)
- [Component side mapping](https://github.com/eunjae-lee/vuex-dry/wiki/Component-side-mapping)
