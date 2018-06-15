export function isValidPath(obj: object, key: string) {
  let o = obj;
  let result = true;
  key.split(".").forEach((k: string) => {
    if (o) {
      result = result && o.hasOwnProperty(k);
      o = (o as any)[k];
    }
  });
  return result;
}

function digWithKeys(
  obj: any,
  keys: Array<string>,
  throwWhenInvalidPath: boolean
) {
  let o = obj;
  keys.forEach((k: string, index: number) => {
    if (!o) {
      return;
    }
    if (!o[k] && throwWhenInvalidPath) {
      throw new Error(`${keys.slice(0, index + 1).join(".")} is ${o[k]}`);
    }
    o = o[k];
  });
  return o;
}

export function dig(obj: any, key: string, throwWhenInvalidPath = true) {
  return digWithKeys(obj, key.split("."), throwWhenInvalidPath);
}

export function deepSet(obj: any, key: string, value: any) {
  const keys = key.split(".");
  const keysExceptForTheLast = keys.slice(0, keys.length - 1);
  const lastKey = keys[keys.length - 1];

  const leafObject = digWithKeys(obj, keysExceptForTheLast, true);
  leafObject[lastKey] = value;
}

export function buildNestedObject(keys: Array<string>, leafValue: any) {
  const obj = {};
  keys.reduce((acc: any, key, index, keys) => {
    if (keys.length - 1 == index) {
      acc[key] = leafValue;
    } else {
      acc[key] = {};
    }
    return acc[key];
  }, obj);
  return obj;
}
