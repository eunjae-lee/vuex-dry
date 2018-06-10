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

export function dig(obj: any, key: string) {
  let o = obj;
  const keys = key.split(".");
  keys.forEach((k: string, index: number) => {
    if (!o[k]) {
      throw new Error(`${keys.slice(0, index + 1).join(".")} is ${o[k]}`);
    }
    o = o[k];
  });
  return o;
}
