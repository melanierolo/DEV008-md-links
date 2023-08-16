const fs = require("fs");

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(path)) {
    } else {
      reject("The route doen't exist.");
    }
  });
};

module.exports = { mdLinks };
