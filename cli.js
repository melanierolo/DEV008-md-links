// CLI - show answers
const { mdLinks } = require("./index.js");

console.log("Case 1:  The path doesn't exists");
mdLinks("/noExiste/")
  .then((result) => {
    console.log("result", result);
  })
  .catch((error) => {
    console.log(error);
  });

console.log(
  "Case 2 :The path exists and is an absolute path to a .txt file. without options"
);
mdLinks("./testsMdLinks/file.txt")
  .then((result) => {
    console.log("result", result);
  })
  .catch((error) => {
    console.log(error);
  });

console.log(
  "Case 3 :The path exists and is an absolute path to a .md file. without options"
);
mdLinks("./testsMdLinks/file.md")
  .then((result) => {
    console.log("result", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log("Case 4 :The path exists and is an absolute path to a directory");
mdLinks("./testsMdLinks")
  .then((result) => {
    console.log("result", result);
  })
  .catch((error) => {
    console.log("error", error);
  });
