const {
  isValidPath,
  validateAbsolutePath,
  isFolder,
  hasMdFileExtension,
  getLinksStatusArray,
  getAllPathOfFileInDirectory,
  calculateStatistics,
  calculateBrokenLinks,
} = require("./auxiliary/auxiliary.js");
const { getLinksInHtmlFile } = require("./auxiliary/get-md-file-and-links.js");

const mdLinks = (path, options) => {
  let { validate, stats } = options;
  // Options
  validate = validate !== true ? false : true;
  stats = stats !== true ? false : true;
  console.log("validate", validate, "stats", stats);
  return new Promise((resolve, reject) => {
    if (isValidPath(path)) {
      const absolutePath = validateAbsolutePath(path);

      // ------------------------ Folder ------------------------

      if (isFolder(absolutePath) && validate === false && stats === false) {
        // Folder - Without options
        const allFiles = getAllPathOfFileInDirectory(absolutePath);
        const allPathsOfMDFiles = allFiles.filter((element) =>
          hasMdFileExtension(element)
        );
        const arrayLinksInFiles = allPathsOfMDFiles.map((pathofMDFile) => {
          const linksOfFile = getLinksInHtmlFile(pathofMDFile);
          return linksOfFile;
        });

        resolve(arrayLinksInFiles);
      } else if (
        isFolder(absolutePath) &&
        (validate === true || stats === true)
      ) {
        // Folder - Options
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
            if (validate === true && stats === false) {
              resolve(arrayLinksWithStatus);
            } else if (validate === false && stats === true) {
              const arrayLinksStatistics =
                calculateStatistics(arrayLinksWithStatus);

              resolve(arrayLinksStatistics);
            } else if (validate === true && stats === true) {
              const arrayLinksStatistics =
                calculateStatistics(arrayLinksWithStatus);
              const arrayLinksBroken =
                calculateBrokenLinks(arrayLinksWithStatus);
              arrayLinksStatistics[0]["Broken"] = arrayLinksBroken[0]["Broken"];

              resolve([...arrayLinksStatistics]);
            } else {
              reject("The file does not have an .md extension");
            }
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        // ------------------------ File ------------------------
        const linksOfFile = getLinksInHtmlFile(absolutePath);

        if (
          hasMdFileExtension(absolutePath) &&
          validate === false &&
          stats === false
        ) {
          // File -without Options
          resolve(linksOfFile);
        } else if (
          hasMdFileExtension(absolutePath) &&
          validate === true &&
          stats === false
        ) {
          // File -Options
          const arrayLinksWithStatus = getLinksStatusArray(linksOfFile);

          resolve(arrayLinksWithStatus);
        } else if (
          hasMdFileExtension(absolutePath) &&
          validate === false &&
          stats === true
        ) {
          getLinksStatusArray(linksOfFile).then((arrayResult) => {
            const arrayLinksStatistics = calculateStatistics(arrayResult);

            resolve(arrayLinksStatistics);
          });
        } else if (
          hasMdFileExtension(absolutePath) &&
          validate === true &&
          stats === true
        ) {
          getLinksStatusArray(linksOfFile).then((arrayResult) => {
            const arrayLinksStatistics = calculateStatistics(arrayResult);
            const arrayLinksBroken = calculateBrokenLinks(arrayResult);
            arrayLinksStatistics[0]["Broken"] = arrayLinksBroken[0]["Broken"];

            resolve([...arrayLinksStatistics]);
          });
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
