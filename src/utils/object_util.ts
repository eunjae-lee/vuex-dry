import get from "lodash.get";

export function deepSet(obj: any, key: string, value: any) {
  const keys = key.split(".");
  const keysExceptForTheLast = keys.slice(0, keys.length - 1);
  const lastKey = keys[keys.length - 1];

  let leafObject;
  if (keysExceptForTheLast.length > 0) {
    leafObject = get(obj, keysExceptForTheLast);
  } else {
    leafObject = obj;
  }
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
