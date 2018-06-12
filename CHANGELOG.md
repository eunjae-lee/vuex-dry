## 0.1.1 (12/Jun/2018)

- You can pass `strict: false` when you set value to an object, then it won't check validation of your path.

```
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
