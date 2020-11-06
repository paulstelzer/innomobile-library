import isEqual from 'lodash/isEqual';
import isPlainObject from 'lodash/isPlainObject';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import transform from 'lodash/transform';

export const generateId = (): string => {
  function S4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }

  return S4() + S4()
}

export const isObjectEmpty = (obj: any) => {
  if (typeof obj !== 'object') {
    return false
  }
  for (const key in obj) {
    if (obj.hasOwnProperty(key))
      return false
  }
  return true
}

/**
 * Merge Deep
 */
export const isObject = (item) => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export const mergeDeep = (target, ...sources) => {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, {[key]: {}});
        }
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const getUrlVars = () => {
  const parameter = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  const vars: object = {};

  for (let i = 0; i < parameter.length; i++) {
    const hash = parameter[i].split('=');
    vars[hash[0]] = hash[1];
  }
  return vars;
}

/**
 * Deep diff between two object, using lodash
 * @param  object Object compared
 * @param  base   Object to compare with
 * @return         Return a new object who represent the diff
 */
export const getDifferenceBetweenObjects = (obj1, obj2) => {
  const changes = (object, base) => {
    return transform(object, (result, value, key) => {
      if (!isEqual(value, base[key])) {
        result[key] = (isObject(value) && isObject(base[key])) ? changes(value, base[key]) : value;
      }
    });
  };
  return changes(obj1, obj2);
}

/**
 * V2: Deep diff between two object, using lodash
 * @param  object Object compared
 * @param  base   Object to compare with
 * @return         Return a new object who represent the diff
 */
export const getObjectDiff = (obj1, obj2) => {
  return reduce(obj1, (result, value, key) => {
    if (isPlainObject(value)) {
      const updates = getObjectDiff(value, obj2[key]);
      if (updates && Object.keys(updates).length > 0) {
        result[key] = updates;
      }
    } else if (!isEqual(value, obj2[key])) {
      result[key] = value;
    }
    return result;
  }, {});
}

export const setObject = (obj, paths) => {
  for (const p of Object.keys(paths)) {
    obj = set(obj, p, paths[p]);
  }
  return obj;
}
