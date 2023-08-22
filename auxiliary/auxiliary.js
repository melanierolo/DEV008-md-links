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

function isFolder(inputAbsolutePath) {
  console.log(inputAbsolutePath);
  const status = fs.statSync(inputAbsolutePath);
  return status.isDirectory();
}

const pathAbs = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/folder/fileTwo.md"
);
const pathAbsTwo = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/folder"
);
console.log("-----Example 2--------:isFolder");
console.log("isFolder", isFolder(pathAbs));
console.log("isFolder", isFolder(pathAbsTwo));

function hasMdFileExtension(inputAbsolutePath) {
  const inputLength = inputAbsolutePath.length;
  const fileExtension = inputAbsolutePath.slice(inputLength - 3, inputLength);
  console.log(
    `[inputAbsolutePath-inputLength]:${inputAbsolutePath}--${inputLength}`
  );
  console.log(`File extension: ${fileExtension}`);
  return fileExtension === ".md" ? true : false;
}

console.log("-----Example 3--------:hasMdFileExtension");
console.log("hasMdFileExtension", hasMdFileExtension(pathAbs));
console.log("hasMdFileExtension", hasMdFileExtension(pathAbsTwo));
console.log("-----Example 4--------:convertMarkdownToHTML");
const fsPromise = require("fs").promises;

async function convertMarkdownToHTML(pathAbs) {
  try {
    const data = await fsPromise.readFile(pathAbs, { encoding: "utf8" });
    const fileHtml = marked.parse(data);
    return fileHtml;
  } catch (error) {
    return error;
  }
}

const pathAbsFileOne = validateAbsolutePath(
  "./../DEV008-md-links/testsMdLinks/file.md"
);
console.log("convertMarkdownToHTML");
convertMarkdownToHTML(pathAbsFileOne)
  .then((result) => {
    console.log("example 4:", result);
  })
  .catch((error) => {
    console.log(error);
  });

console.log("-----Example 5--------:getLinksInHtmlFile");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function getLinksInHtmlFile(pathAbsFileOne) {
  try {
    let linksObjectsArray = [];
    const htmlContent = await convertMarkdownToHTML(pathAbsFileOne);
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

getLinksInHtmlFile(pathAbsFileOne).then((document) => {
  console.log("getLinksInHtmlFile-docu", document);
});
