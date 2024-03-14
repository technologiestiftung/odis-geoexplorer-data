module.exports = function findProperty(obj, targetPropertyNames) {
  let result = null;

  function search(obj, propNames) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (propNames.includes(key)) {
          result = obj[key];
          return;
        } else if (typeof obj[key] === "object") {
          search(obj[key], propNames);
        }
      }
    }
  }

  if (Array.isArray(targetPropertyNames)) {
    for (let propName of targetPropertyNames) {
      search(obj, propName);
      if (result !== null) {
        break;
      }
    }
  } else {
    search(obj, targetPropertyNames);
  }

  return result;
};
