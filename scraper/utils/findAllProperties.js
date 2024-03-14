module.exports = function findAllProperties(obj, targetKey, results = []) {
  if (Array.isArray(targetKey)) {
    for (let key in obj) {
      if (targetKey.includes(key)) {
        results.push(obj[key]);
      } else if (typeof obj[key] === "object") {
        findAllProperties(obj[key], targetKey, results);
      }
    }
  } else {
    for (let key in obj) {
      if (key === targetKey) {
        results.push(obj[key]);
      } else if (typeof obj[key] === "object") {
        findAllProperties(obj[key], targetKey, results);
      }
    }
  }
  return results;
};
