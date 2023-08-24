//  the file contains auxiliary functions
const fs = require("fs");
const path = require("path");
const { marked } = require("marked");

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
/*console.log("-------Example 0");
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
*/
function isFolder(inputAbsolutePath) {
  console.log(inputAbsolutePath);
  const status = fs.statSync(inputAbsolutePath);
  return status.isDirectory();
}

/*const pathAbs = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/folder/fileTwo.md"
);
const pathAbsTwo = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/folder"
);
console.log("-----Example 2--------:isFolder");
console.log("isFolder", isFolder(pathAbs));
console.log("isFolder", isFolder(pathAbsTwo));*/

function hasMdFileExtension(inputAbsolutePath) {
  const inputLength = inputAbsolutePath.length;
  const fileExtension = inputAbsolutePath.slice(inputLength - 3, inputLength);
  console.log(
    `[inputAbsolutePath-inputLength]:${inputAbsolutePath}--${inputLength}`
  );
  console.log(`File extension: ${fileExtension}`);
  return fileExtension === ".md" ? true : false;
}
/*
console.log("-----Example 3--------:hasMdFileExtension");
console.log("hasMdFileExtension", hasMdFileExtension(pathAbs));
console.log("hasMdFileExtension", hasMdFileExtension(pathAbsTwo));
console.log("-----Example 4--------:convertMarkdownToHTML");*/

function convertMarkdownToHTML(pathAbs) {
  try {
    const data = fs.readFileSync(pathAbs, { encoding: "utf8" });
    const fileHtml = marked.parse(data);
    return fileHtml;
  } catch (error) {
    return error;
  }
}
/*
const pathAbsFileOne = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/file.md"
);
console.log("convertMarkdownToHTML");
convertMarkdownToHTML(pathAbsFileOne);

console.log("-----Example 5--------:getLinksInHtmlFile");*/
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function getLinksInHtmlFile(pathAbsFileOne) {
  try {
    let linksObjectsArray = [];
    const htmlContent = convertMarkdownToHTML(pathAbsFileOne);
    console.log("get HTML", htmlContent);
    const dom = new JSDOM(htmlContent, { includeNodeLocations: true }); // Include the option here
    const document = dom.window.document;
    const anchorElements = document.querySelectorAll("a");
    anchorElements.forEach((anchor) => {
      const element = {
        href: anchor.href,
        text: anchor.text,
        file: pathAbsFileOne,
      };
      linksObjectsArray.push(element);
    });
    return linksObjectsArray;
  } catch (error) {
    console.error(error);
  }
}

/*console.log(getLinksInHtmlFile(pathAbsFileOne));*/

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
  const totalLinks = arrayOfLinksWithStatus.length;
  const uniqueLinks = arrayOfLinksWithStatus.filter(
    (element, index) => arrayOfLinksWithStatus.indexOf(element) === index
  ).length;
  return [{ Total: totalLinks, Unique: uniqueLinks }];
}

function calculateBrokenLinks(arrayOfLinksWithStatus) {
  let count = 0;
  arrayOfLinksWithStatus.forEach((link) => {
    console.log("link.status", link.status);
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
  getLinksStatusArray,
};
