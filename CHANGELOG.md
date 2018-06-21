## 0.1.14 (21/Jun/2018)

- You can pass key, value for `$find`

```js
store.getters["myModule/posts$find"]("id", 3);
```

## 0.1.5 (14/Jun/2018)

- You can use `get` or `sync` mapper in your component to map nested path of object like the following:

```js
computed: {
  bio: get("myModule/user", "profile.bio");
  city: sync("myModule/user", "address.city");
}
```

## 0.1.3 (12/Jun/2018)

- You can pass `strict: false` when you set value to an object, then it won't check validation of your path.

```js
Module.build({
  state() {
    return {
      user: {}
    }
  }
})

...

store.commit("myModule/user$set", {
  key: "address.city",
  value: "Singapore",
  strict: false
});
```

This enables you can add keys dynamically.

## 0.1.0 (12/Jun/2018)

- Initial public release
