export * from "./hooks";
import { message, Menu } from "antd";
import { get, isEmpty, capitalize } from "lodash";
import qs from "qs";
import moment from "moment";

/**
 * @param  {object} antFormError
 * @return  {boolean}
 */

export function hasFormErrors(antFormError) {
  return Object.keys(antFormError).some((field) => antFormError[field]);
}

/**
 * @param  {object} error
 * @param  {string} defaultMessage - fallback message when API doesn't give an error message
 */
export function alertErr(
  err,
  defaultMessage = "connection error, check your connection!"
) {
  const errMessage = get(err, "response.data.message");
  message.error(errMessage || defaultMessage);
}

// Handle object to array for getting API
export const setToArray = (resp) => {
  let theData;
  const obj = Object.entries(resp);

  obj.forEach(([key, value]) => {
    if (key === `data`) {
      const obj2 = Object.entries(value);
      obj2.forEach(([key, value]) => {
        if (key === `list`) {
          theData = value;
        }
      });
    }
  });
  return theData;
};

// Handle nested filter
export const nestedFilter = (targetArray, filters) => {
  let filterKeys = Object.keys(filters);
  return targetArray.filter(function (eachObj) {
    return filterKeys.every(function (eachKey) {
      if (!filters[eachKey].length) {
        return true;
      }
      return filters[eachKey].includes(eachObj[eachKey]);
    });
  });
};

export function replaceCharacterWithLine(data, character) {
  //convert string to array and remove whitespace
  let dataToArray = data.split(character).map((item) => item.trim());
  //convert array to string replacing character with new line
  return dataToArray.reverse().join("\n");
}

export function setCreateEditMessage(response, successMsg, failedMsg) {
  if (response.status === "FAILED") {
    if (response.resultCode === "BR") {
      message.error(failedMsg);
    } else {
      message.error(response.desc);
    }
  } else {
    message.success(successMsg);
  }
}

//Convert array to options style
export const convertOptions = (arrayData, objValue, differentValue) => {
  const dataOpts = differentValue
    ? arrayData.map((value) => ({
        label: objValue ? value[objValue] : value,
        value: differentValue ? value[differentValue] : value,
      }))
    : arrayData.map((value) => ({
        label: objValue ? value[objValue] : value,
        value: objValue ? value[objValue] : value,
      }));

  /**
   * Need to transform select.value into string since we got
   * warning message
   */
  const transformed = dataOpts.map(function (item) {
    item.value = String(item.value);
    return item;
  });

  const handleDuplicateDataOpts = transformed.filter(
    (value, index, array) =>
      array.findIndex((t) => t.label === value.label) === index
  );

  return handleDuplicateDataOpts;
};

// default stringify options
export const defaultStringifyOpts = (options) => {
  const defaultOpts = {
    encode: false,
    addQueryPrefix: true,
    indices: false,
    arrayFormat: "comma",
    sort: "alphabeticalSort",
  };

  return { ...defaultOpts, ...options };
};

//Stringify query object into string
export const queryStringify = (queryParams, options = {}) => {
  const opts = defaultStringifyOpts(options);
  return qs.stringify(queryParams, opts);
};

export const removeEmptyAttributes = (objParams) => {
  const dataParams = { ...objParams };
  const entries = Object.entries(dataParams);
  for (const [key, value] of entries) {
    if (!value) delete dataParams[key];
    if (Array.isArray(dataParams[key]) && !value.length) {
      delete dataParams[key];
    }
  }
  return dataParams;
};

//Check if value exists in object array
export const checkValueInObjectArray = (array, value) => {
  return array.some(function (el) {
    return el.value === value;
  });
};

export const checkPrivileges = (userById, privilegeId) => {
  if (!isEmpty(userById) && !isEmpty(userById.roles)) {
    const filtered = userById.roles.filter(function (r) {
      if (!isEmpty(r.privileges)) {
        return r.privileges.some(
          (privilege) => privilege["id"] === privilegeId
        );
      }
      return false;
    });

    return filtered.length > 0;
  }
  return false;
};

export const truncateWord = (str, noWords) => {
  return str.split(" ").splice(0, noWords).join(" ");
};

export const avatarColor = (firstLetter) => {
  const letterForRed = ["Q", "W", "E", "C", "R", "T", "Y", "U", "I"];
  const letterForGreen = ["O", "P", "B", "S", "D", "F", "G", "H", "M"];
  // const letterForYellow = ['J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'];
  if (letterForRed.includes(capitalize(firstLetter))) {
    return "bg-danger";
  } else if (letterForGreen.includes(capitalize(firstLetter))) {
    return "bg-success";
  } else {
    return "bg-warning";
  }
};

/**
 * get difference of timestamp from now UTC
 * @param tsUtc timestamp
 * @returns {moment.Duration} moment.js duration object
 */
export const diffFromNow = (tsUtc) => {
  const n = moment.utc();
  const struct = moment.duration(moment(n).diff(tsUtc));
  return struct;
};

/**
 * convert string with value {'true' | 'false'}
 * to boolean
 * @param {string} s
 * @return {boolean}
 */
export const stringToBoolean = (s) => {
  return s.toLowerCase() === "true" ? true : false;
};

export const splitArr = (index) => (it) => {
  return [it.slice(0, index), it.slice(index)];
};
/**
 * iterate over an object properties
 * to build <MenuItem> component
 * @param objects object that has following props
 * {
 *     MenuItemComp: {
 *         key: () => {
 *             return <string>
 *         },
 *         value: () => {
 *             return <string>
 *         }
 *     }
 * }
 * @return {*[]} array of MenuItem
 */
export const objectPropsToMenuItems = (objects) => {
  let menuItems = [];
  Object.keys(objects).forEach(function (key) {
    menuItems.push(
      <Menu.Item key={objects[key].MenuItemComp.key()}>
        {objects[key].MenuItemComp.value()}
      </Menu.Item>
    );
  });
  return menuItems;
};

export const timeDiff = (t1, t2) => {
  const struct = moment.duration(moment(t2).diff(t1));
  return struct;
};

// get unique value
export const uniqBy = (a, key) => {
  var seen = {};
  return a.filter(function (item) {
    var k = key(item);
    return seen.hasOwnProperty(k) ? false : (seen[k] = true);
  });
};

export const dateToDaysDuration = (date) => {
  if (!date || date === "") {
    return false;
  }

  const created = moment(date, "YYYY-MM-DD HH:mm:ss");

  const now = new Date();
  const duration = moment.duration({ from: created, to: now });

  return duration.humanize();
};

export const numberToRupiah = (value) => {
  if (!value) return "";
  let _value = Number(value);

  if (isNaN(_value)) return "";

  _value = _value.toLocaleString("id-ID");
  return `Rp${_value}`;
};

export const sortingAsc = (type, param) => {
  let result;

  if (type === "ticket-solution") {
    const sorted = param.split(",");
    result = sorted.sort((a, b) => a - b).join(", ");
  }
  if (type === "ticket") {
    const parse = param.join();
    result = parse
      .split(",")
      .sort((a, b) => a - b)
      .join(", ");
  }

  return result;
};

export const wordsCapitalize = (str) => {
  if (!str) return "";

  const arr = str.split("_").join(" ").toLowerCase();
  const result = arr.split(" ");

  for (var i = 0; i < result.length; i++) {
    result[i] = result[i].charAt(0).toUpperCase() + result[i].slice(1);
  }

  return result.join(" ");
};

export const getHashOfString = (str) => {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    // tslint:disable-next-line: no-bitwise
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  return hash;
};

export const normalizeHash = (hash, min, max) => {
  return Math.floor((hash % (max - min)) + min);
};

export const generateHSL = (name, saturationRange, lightnessRange) => {
  const hash = getHashOfString(name);
  const h = normalizeHash(hash, 0, 360);
  const s = normalizeHash(hash, saturationRange[0], saturationRange[1]);
  const l = normalizeHash(hash, lightnessRange[0], lightnessRange[1]);
  return [h, s, l];
};

export const HSLtoString = (hsl) => {
  return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2]}%)`;
};

export const generateColorHsl = (id, saturationRange, lightnessRange) => {
  return HSLtoString(generateHSL(id, saturationRange, lightnessRange));
};

export const getInitials = (user) => {
  let username = "";

  const names = user.split(" ");
  if (names.length >= 2)
    username = `${names[0].substring(0, 1)}${names[1].substring(0, 1)}`;
  if (names.length === 1) username = names[0].substring(0, 2);

  return username.toUpperCase();
};

export const getRange = (value, range) => {
  return [Math.max(0, value - range), Math.min(value + range, 100)];
};

export const textReplacement = (str) => {
  if (!str) return "";

  switch (str) {
    case "CREATED":
      return "Created";
    case "DELETED":
      return "Deleted";

    default:
      return str;
  }
};
