module.exports = function findAllObject(obj, targetKey, results = []) {
  if (Array.isArray(targetKey)) {
    for (let key in obj) {
      if (targetKey.includes(key)) {
        results.push(obj);
      } else if (typeof obj[key] === "object") {
        findAllObject(obj[key], targetKey, results);
      }
    }
  } else {
    for (let key in obj) {
      if (key === targetKey) {
        results.push(obj);
      } else if (typeof obj[key] === "object") {
        findAllObject(obj[key], targetKey, results);
      }
    }
  }
  return results;
};
