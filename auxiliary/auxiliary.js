//  the file contains auxiliary functions
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

function isValidPath(inputPath) {
  const normalizePath = path.normalize(inputPath);
  if (fs.existsSync(normalizePath)) {
    return true;
  } else {
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

const pathAbsFileOne = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/file.md"
);
console.log(pathAbsFileOne);

function isFolder(inputAbsolutePath) {
  const status = fs.statSync(inputAbsolutePath);
  return status.isDirectory();
}

/*console.log("-----Example 2--------:isFolder");
console.log("isFolder", isFolder(pathAbs));
console.log("isFolder", isFolder(pathAbsTwo));*/

function readContentDirectory(directoryAbsPath) {
  let subdirectories = [];
  subdirectories = fs.readdirSync(directoryAbsPath).map((fileName) => {
    return path.join(directoryAbsPath, fileName);
  });
  return subdirectories;
}

// Test
console.log("Test---readContentDirectory");
const absPathThree =
  "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks";
console.log(readContentDirectory(absPathThree));

function getAllPathOfFileInDirectory(absPathOfFolder) {
  const arrayOfPaths = readContentDirectory(absPathOfFolder);
  const someElementIsFolder = arrayOfPaths.some((element) => isFolder(element));

  if (!someElementIsFolder) {
    return arrayOfPaths;
  } else {
    const fileElements = arrayOfPaths.filter((element) => !isFolder(element));
    const folderElements = arrayOfPaths.filter((element) => isFolder(element));

    // Process each folder element recursively and, thanks to flatMap, prevent the formation of nested arrays
    const subFolderPaths = folderElements.flatMap((folderPath) => {
      return getAllPathOfFileInDirectory(folderPath);
    });

    // It combines the paths of files and the paths of files within subdirectories
    return [...fileElements, ...subFolderPaths];
  }
}

// Test
console.log("Test 1 -baseCase:--getAllPathOfFileInDirectory");
const absPathFour =
  "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\FolderFiles";
console.log(getAllPathOfFileInDirectory(absPathFour));

console.log("Test 2 : getAllPathOfFileInDirectory");
const absPathFive =
  "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\FolderParent";
console.log(getAllPathOfFileInDirectory(absPathFive));

console.log("Test 3 : getAllPathOfFileInDirectory");
const absPathSix =
  "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks";
console.log(getAllPathOfFileInDirectory(absPathSix));

function hasMdFileExtension(inputAbsolutePath) {
  const inputLength = inputAbsolutePath.length;
  const fileExtension = inputAbsolutePath.slice(inputLength - 3, inputLength);

  return fileExtension === ".md" ? true : false;
}
/*
console.log("-----Example 3--------:hasMdFileExtension");
console.log("hasMdFileExtension", hasMdFileExtension(pathAbs));
console.log("hasMdFileExtension", hasMdFileExtension(pathAbsTwo));*/

/*--------------Example 6 */
/*console.log("---------------Example 6");
const objectOfLink = {
  href: "https://github.com/markedjs/marked",
  text: "Marked",
  file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
};*/

function checkLinkStatus(objectOfLink) {
  return fetch(objectOfLink.href);
}

/*let newObjectLink = { ...objectOfLink };
checkLinkStatus(objectOfLink)
  .then((response) => {
    newObjectLink.ok = response.ok ? "OK" : "FAIL";
    newObjectLink.status = response.status;
    console.log(newObjectLink);
    console.log("response.status: ", response.status);
    console.log("Link:", objectOfLink.href);
    console.log("Status:", response.status);
    console.log(
      "Error Details:",
      response.errorDetails || "No error details available"
    );
    console.log("----------");
    return newObjectLink;
  })
  .catch((err) => {
    console.log(err);
    return err;
  });*/

function getLinksStatusArray(linkObjectsArray) {
  const linksPromises = linkObjectsArray.map((link) => {
    let newLink = { ...link };
    return fetch(link.href)
      .then((response) => {
        newLink.ok = response.ok ? "OK" : "FAIL";
        newLink.status = response.status;
        newLink.message = response.statusText;
        return newLink;
      })
      .catch((error) => {
        newLink.ok = "FAIL";
        newLink.status = 0;
        newLink.message = error.message;
        return newLink;
      });
  });

  // devuelve una nueva promesa que se resuelve cuando todas las promesas en el arreglo se han resuelto
  return Promise.all(linksPromises);
}

function calculateStatistics(arrayOfLinksWithStatus) {
  // Calculate the total number of links in the array
  const totalLinks = arrayOfLinksWithStatus.length;
  // Create an array containing all the href values from the links
  const linksArray = arrayOfLinksWithStatus.map((element) => element.href);
  // Filter unique links (without duplicates)
  const uniqueLinks = arrayOfLinksWithStatus.filter(
    ({ href }, index) => !linksArray.includes(href, index + 1)
  ).length;

  return [{ Total: totalLinks, Unique: uniqueLinks }];
}

function calculateBrokenLinks(arrayOfLinksWithStatus) {
  let count = 0;
  arrayOfLinksWithStatus.forEach((link) => {
    if (link.status !== 200) {
      count++;
    }
  });
  return [{ Broken: count }];
}

// TESTS
/*const arrayOfLinks = getLinksInHtmlFile(pathAbsFileOne);

const arrayOfLinksWithStatus = getLinksStatusArray(arrayOfLinks).then(
  (arrayLinks) => {
    console.log("arrayLinks", arrayLinks);
    console.log(calculateStatistics(arrayLinks));
    console.log(calculateBrokenLinks(arrayLinks));
  }
);

console.log("arrayOfLinksWithStatus", arrayOfLinksWithStatus); // Promise
*/
module.exports = {
  isValidPath,
  convertToAbsPath,
  validateAbsolutePath,
  isFolder,
  getAllPathOfFileInDirectory,
  hasMdFileExtension,
  getLinksStatusArray,
  calculateStatistics,
  calculateBrokenLinks,
};
