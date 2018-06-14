# Document

<!-- toc -->

- [Install](#install)
- [Getting Started](#getting-started)
- [Adding your own getters, mutations and actions](#adding-your-own-getters-mutations-and-actions)
- [Module with Object state](#module-with-object-state)
- [Module with Array state](#module-with-array-state)
- [Component side mapping](#component-side-mapping)
- [So, why `vuex-dry`?](#so-why-vuex-dry)

<!-- tocstop -->

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

## Adding your own getters, mutations and actions

As you know, the following is simple enough to cover all basic needs.

```js
Module.build({
  state() {
    return {
      name: undefined
    };
  }
});
```

However you, of course, can add your own getters, mutations, and actions.

```js
Module.build({
  state() {
    return {
      name: undefined
    };
  },
  getters: {
    upperCaseName: state => (state.name || "").toUpperCase()
  },
  mutations: {
    reverseName(state) {
      state.name = (state.name || "")
        .split("")
        .reverse()
        .join("");
    }
  },
  actions: {
    async randomName({ commit }) {
      const name = await nameService.getRandomName();
      commit("name$assign", name);
      return name;
    }
  }
});
```

Nothing special. Same as usual, right?

You can also put nested modules.

```js
Module.build({
  state() {
    return {
      name: undefined
    }
  },
  modules: {
    a: Module.build({...})
  }
});
```

## Module with Object state

```js
Module.build({
  state() {
    return {
      user: {
        profile: {
          bio: "default bio message"
        },
        address: {
          street1: undefined,
          street2: undefined,
          city: undefined
        }
      }
    };
  }
});
```

Let's say we've defined a module like that. Like we saw before, it will automatically add `posts$assign`, `posts$reset` and `$resetAll`.
Since this is an object, we need a few more things.

### getters

This is a method-style access. It will run each time you call. It's not cached.
(Refer to [this](https://vuex.vuejs.org/guide/getters.html#method-style-access))

#### user$get

```js
const bio = store.getters["myModule/user$get"]("profile.bio");
console.log(bio); // "default bio message"
```

To make it clear, let me break down this part: `["myModule/user$get"]("profile.bio")`

- `myModule`: The name of your module, used when `new Vuex.Store({...})`
- `user`: The first level property of the object returned by `state()`
- `profile.bio`: A nested path of `user`

### mutations

#### user$set

```js
store.commit("myModule/user$set", {
  key: "address.city",
  value: "Singapore"
});
```

## Module with Array state

Like `vuex-dry` provides object-specific features, it does for array as well.

```js
Module.build({
  state() {
    return {
      posts: []
    };
  }
});
```

### getters

This is also a method-style access.

#### posts$find

It finds one object matching with a testing function from an array.

```js
const post = store.getters["myModule/posts$find"](post => post.id == 3);
```

#### posts$filter

It finds all objects matching with a testing function from an array.

```js
const posts = store.getters["myModule/posts$filter"](post => post.published);
```

### mutations

#### posts$add

It adds an item to an array.

```js
store.commit("myModule/posts$add", post);
```

#### posts$delete

It deletes an item matching with a testing function from an array.

```js
store.commit("myModule/posts$delete", post => post.id == 3);
```

#### posts$update

It updates an item matching with a testing function from an array. If there's no matched item, then the item is added to the array.

```js
store.commit("myModule/posts$update", {
  value: myPost,
  test: x => x.id == 2
});
```

You can also put a column name into `test` like:

```js
store.commit("myModule/posts$update", {
  value: myPost,
  test: "id"
});
```

Then it will find a post where its id is same with `myPost.id` and update it with `myPost`. So it's effectively same with:

```js
store.commit("myModule/posts$update", {
  value: myPost,
  test: post => post.id == myPost.id
});
```

## Component side mapping

`vuex-dry` provides mapping functions which are similar to built-in mappers from `vuex` like `mapGetters`, `mapMutations`, etc.

At store-side,

```js
Module.build({
  state() {
    return {
      name: undefined
    };
  },
  actions: {
    load() {
      // do some http call
    }
  }
});
```

At component-side,

```js
import { get, sync, action } from "vuex-dry";
```

#### get

You can map getters.

```js
computed: {
  name: get("myModule/name");
}
```

#### sync

When you want to do two-way binding, you can use `sync`. It's nothing magical, but just a simple implementation of [this page](https://vuex.vuejs.org/guide/forms.html).

```js
computed: {
  name: sync("myModule/name");
}
```

#### action

You can map actions.

```js
methods: {
  load: action("myModule/load"),
  updateName: action("myModule/name$assign")
}
```

```js
this.load();
```

You can pass one parameter of payload when you need it.

```js
this.updateName("Paul");
```

### Mapping nested property of object

At store-side,

```js
const myModule = Module.build({
  state() {
    return {
      user: {
        profile: {
          bio: "default bio message"
        }
      }
    };
  }
});

const store = new Vuex.Store({
  modules: {
    myModule
  }
});
```

What if you want to map `bio` property directly into your component?

```js
computed: {
  bio: get("myModule/user", "profile.bio");
}
```

You pass second optional `nestPath` parameter like that.

What if you want to map `bio` property and use it in an `input` which means you want it to be `sync`ed?

```js
computed: {
  bio: sync("myModule/user", "profile.bio");
}
```

It works just like that.

## So, why `vuex-dry`?

It keeps your code DRY. You don't have to write meaningless similar codes over and over again.

### Then why not `vuex-pathify`?

`vuex-pathify` is a great library. It let you do things without any coding but just with conventions. A downside is it introduces its own conventions and once you get started with it, you're in a whole new thing. In the inside, you're using vuex through `vuex-pathify`, but on the outside you actually are not using `vuex` anymore.

On the other hand, `vuex-dry` just simply creates vuex modules and they are completely compatible with your existing vuex store and modules. And since it's creating pure vuex modules, you can extend it as you want. It's highly customizable. In that sense, it's really easy to introduce `vuex-dry` into your current project and you don't even have to replace all your vuex codes with `vuex-dry`. You can partially adjust `vuex-dry` and there's no problem with that.
