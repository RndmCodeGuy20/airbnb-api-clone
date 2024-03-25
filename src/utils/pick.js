/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @return {Object}
 */
export const pick = (object, keys) => {
  return keys.reduce((obj, key) => {
    if (object && Object.hasOwn(object, key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
};
