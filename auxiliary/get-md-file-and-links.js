const fs = require("fs");
const marked = require("marked");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function convertMarkdownToHTML(pathAbs) {
  try {
    const data = fs.readFileSync(pathAbs, { encoding: "utf8" });
    const fileHtml = marked.parse(data);
    return fileHtml;
  } catch (error) {
    return error;
  }
}

function getLinksInHtmlFile(pathAbsFileOne) {
  try {
    let linksObjectsArray = [];
    const htmlContent = convertMarkdownToHTML(pathAbsFileOne);
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

module.exports = {
  convertMarkdownToHTML,
  getLinksInHtmlFile,
};
