const {
  isValidPath,
  validateAbsolutePath,
  isFolder,
  hasMdFileExtension,
  getLinksStatusArray,
  getAllPathOfFileInDirectory,
} = require("./auxiliary/auxiliary.js");
const { getLinksInHtmlFile } = require("./auxiliary/get-md-file-and-links.js");

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if (isValidPath(path)) {
      const absolutePath = validateAbsolutePath(path);

      if (isFolder(absolutePath)) {
        const allFiles = getAllPathOfFileInDirectory(absolutePath);
        const allPathsOfMDFiles = allFiles.filter((element) =>
          hasMdFileExtension(element)
        );
        const arrayLinksWithStatus = [];

        const promises = allPathsOfMDFiles.map((pathofMDFile) => {
          const linksOfFile = getLinksInHtmlFile(pathofMDFile);
          return getLinksStatusArray(linksOfFile).then((result) => {
            arrayLinksWithStatus.push(...result);
          });
        });

        Promise.all(promises)
          .then(() => {
            resolve(arrayLinksWithStatus);
          })
          .catch((error) => {
            reject(error);
          });
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
