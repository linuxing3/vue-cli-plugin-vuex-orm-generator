import { keyBy, reduce, map, mapKeys, mapValues, pick, pickBy, get, find, set } from "lodash";
/**
 * Utility function to create a string array from keys of any object
 *
 * @param {Array} object from any class with string typed keys
 * @returns {Array} Returns the array as accumulated value
 */
export function stringArrayFromClassKeys<T extends object>(o: T): string[] {
  return Object.keys(o).reduce((res: any[], key: string) => {
    if (typeof o[key] === "string") res.push(key);
    return res;
  }, []);
}

export function objectArrayFromClassKeys<T extends object>(o: T): string[] {
  return Object.keys(o).reduce((res: any[], key: string) => {
    if (typeof o[key] === "object") res.push(key);
    return res;
  }, []);
}
export function objectFromClassKeys<T extends object>(o: T): T {
  return Object.keys(o).reduce((res: T, key: string) => {
    if (typeof o[key] === "object") res[key] = o[key];
    return res;
  }, Object.create(null));
}
/**
 * Utility function to create a K:V from a list of strings
 * @param {Array} [array] The array of string
 * @returns {*} Returns the object as accumulated value
 *
 * Usage:
 * classFromStringArray({name: "xxx"})  -> {name: name}
 */
export function classFromStringArray<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

/**
 * Utility function to create a K:V from a object with specific type of value
 * @param {Array} [array] The array of string
 * @returns {*} Returns the object as accumulated value
 *
 * Usage:
 * selectedDeepClone({}, "string") -> {name: ""}
 * selectedDeepClone({}, "object") -> {name: {...}}
 * selectedDeepClone({}, "undefined") -> {name: undefined}
 */
export function selectedDeepClone<T extends object, S extends string>(
  o: T,
  f: S,
): { [K in keyof T]: any } {
  return Object.keys(o).reduce((res, key) => {
    if (typeof o[key] === f) {
      res[key] = o[key];
    }
    return res;
  }, Object.create(null));
}

/**
 * Utility function to create a array from a object with specific type of key
 * @param {Array} [array] The array of string
 * @returns {Array} Returns the array as accumulated value
 *
 * Usage:
 * selectedDeepClone({}, "string") -> {name: ""}
 * selectedDeepClone({}, "object") -> {name: {...}}
 * selectedDeepClone({}, "undefined") -> {name: undefined}
 */
export function selectedDeepMining<T extends object, S extends string>(o: T, f: S): S[] {
  return Object.keys(o).reduce((res, key) => {
    if (typeof o[key] !== "object") {
      res.push(key);
    } else {
      res.push(selectedDeepMining(o[key], "object"));
    }
    return res;
  }, []);
}

/**
 * Utility function to create a object from a array, get the _id of each item
 * as the key, while item itself as value
 * @param {Array} [array] The array of object, each item has a _id key
 * @returns {Object} Returns the object as accumulated value
 *
 * Usage:
 * stateObjectFromArray([{"_id": "1", "name": "joe"}]) -> {"1": {...}}
 * keyBy([o,...], (o)=> o["_id"])
 */
export function stateObjectFromArray<T extends any, K extends string>(a: Array<T>): { K: T } {
  return a.reduce((res, item) => {
    res[item["_id"]] = item;
    return res;
  }, Object.create(null));
}

export function pullFromArray(array: any[], matched: any) {
  return array.reduce((arr, item) => {
    if (!item.match(matched)) {
      arr.push(item);
    }
    return arr;
  }, []);
}
