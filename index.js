const {
  isValidPath,
  validateAbsolutePath,
  isFolder,
  hasMdFileExtension,
  getLinksStatusArray,
} = require("./auxiliary/auxiliary.js");
const { getLinksInHtmlFile } = require("./auxiliary/get-md-file-and-links.js");

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (isValidPath(path)) {
      const absolutePath = validateAbsolutePath(path);
      if (isFolder(absolutePath)) {
        console.log("isFolder");
      } else {
        if (hasMdFileExtension(absolutePath)) {
          const linksOfFile = getLinksInHtmlFile(absolutePath);
          const arrayLinksWithStatus = getLinksStatusArray(linksOfFile);
          resolve(arrayLinksWithStatus);
        } else {
          reject("The file does not have an .md extension");
        }
      }
    } else {
      reject("The path doesn't exist.");
    }
  });
};

module.exports = { mdLinks };
