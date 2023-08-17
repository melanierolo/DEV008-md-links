//  the file contains auxiliary functions
const fs = require("fs");
const path = require("path");

function isValidPath(inputPath) {
  const normalizePath = path.normalize(inputPath);
  if (fs.existsSync(normalizePath)) {
    return true;
  } else {
    console.log("Path cannot be empty o doesn't exist");
    return false;
  }
}

function convertToAbsPath(inputPath) {
  return path.resolve(inputPath);
}

function validateAbsolutePath(inputPath) {
  const normalizePath = path.normalize(inputPath);
  if (path.isAbsolute(normalizePath)) {
    return normalizePath;
  } else {
    return convertToAbsPath(normalizePath);
  }
}
console.log("-------Example 0");
console.log("isValidPath:", isValidPath("./noExiste"));
console.log("-------Example 1");
console.log(
  "isValidPath:",
  isValidPath("./../DEV008-md-links/testsMdLinks/folder/fileTwo.md")
);
console.log(
  "validateAbsolutePath:",
  validateAbsolutePath("./../DEV008-md-links/testsMdLinks/folder/fileTwo.md")
);
