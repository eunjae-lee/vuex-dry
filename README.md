<p align="center"><img width="256" src="https://raw.githubusercontent.com/eunjae-lee/vuex-dry/master/logo.png"></p>

## Introduction

`vuex-dry` helps keep your vuex code DRY.
It doesn't introduce any whole new way to use vuex.
It just helps build modules for you with a minimum amount of code, adding some convenient getters, mutations, and actions.

`vuex-dry` is TypeScript-friendly since it's written in TypeScript.

<!-- basic -->

## Install

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

## Getting Started

### Simple Module

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

<!-- basicstop -->

## Interested?

Let me show you how easy you can access/handle arrays and objects with `vuex-dry`.

And you will see how to map those getters in your component and you even can map a specific nested property of an object.

➡️ [READ THE FULL DOCUMENT📜](https://github.com/eunjae-lee/vuex-dry/blob/master/DOCUMENT.md#adding-your-own-getters-mutations-and-actions) (It will probably take only 3 minutes)

## So, why `vuex-dry`?

It keeps your code DRY. You don't have to write meaningless similar codes over and over again.

### Then why not `vuex-pathify`?

`vuex-pathify` is a great library. It let you do things without any coding but just with conventions. A downside is it introduces its own conventions and once you get started with it, you're in a whole new thing. In the inside, you're using vuex through `vuex-pathify`, but on the outside you actually are not using `vuex` anymore.

On the other hand, `vuex-dry` just simply creates vuex modules and they are completely compatible with your existing vuex store and modules. And since it's creating pure vuex modules, you can extend it as you want. It's highly customizable. In that sense, it's really easy to introduce `vuex-dry` into your current project and you don't even have to replace all your vuex codes with `vuex-dry`. You can partially adjust `vuex-dry` and there's no problem with that.

## Contributing

1.  Fork it!
2.  Create your feature branch: git checkout -b my-new-feature
3.  Commit your changes: git commit -am 'Add some feature'
4.  Push to the branch: git push origin my-new-feature
5.  Submit a pull request :D

## Author

Eunjae Lee, Released under the [MIT](https://github.com/eunjae-lee/vuex-dry/blob/master/LICENSE.md) License.
