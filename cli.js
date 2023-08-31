// CLI - show answers
const { mdLinks } = require("./index.js");

console.log("Case 1:  The path doesn't exists");
mdLinks("/noExiste/", { validate: false, stats: false })
  .then((result) => {
    console.log("result-1", result);
  })
  .catch((error) => {
    console.log(error);
  });

console.log(
  "Case 2 :The path exists and is an absolute path to a .txt file. without options"
);
mdLinks("./testsMdLinks/file.txt", { validate: false, stats: false })
  .then((result) => {
    console.log("result-2", result);
  })
  .catch((error) => {
    console.log(error);
  });

console.log(
  "Case 3 -1:The path exists and is an absolute path to a .md file. without options"
);
mdLinks("./testsMdLinks/file.md", { validate: false, stats: false })
  .then((result) => {
    console.log("result 3-1", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log(
  "Case 3 -2:The path exists and is an absolute path to a .md file. with options :validate"
);
mdLinks("./testsMdLinks/file.md", { validate: true, stats: false })
  .then((result) => {
    console.log("result-3-2", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log(
  "Case 3 -3:The path exists and is an absolute path to a .md file. with options:stats"
);
mdLinks("./testsMdLinks/file.md", { validate: false, stats: true })
  .then((result) => {
    console.log("result-3-3", result);
  })
  .catch((error) => {
    console.log("error", error);
  });
console.log(
  "Case 3 -4:The path exists and is an absolute path to a .md file. with options: validate and stats"
);
mdLinks("./testsMdLinks/file.md", { validate: true, stats: true })
  .then((result) => {
    console.log("result-3-2", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log("Case 4-1:The path exists and is an absolute path to a directory");
mdLinks("./testsMdLinks", { validate: false, stats: false })
  .then((result) => {
    console.log("result-4-1", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log(
  "Case 4-2:The path exists and is an absolute path to a directory. With options: validate"
);
mdLinks("./testsMdLinks/folderParent", { validate: true, stats: false })
  .then((result) => {
    console.log("result-4-2", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log(
  "Case 4-3:The path exists and is an absolute path to a directory. With options: stats"
);
mdLinks("./testsMdLinks/folderParent", { validate: false, stats: true })
  .then((result) => {
    console.log("result-4-2", result);
  })
  .catch((error) => {
    console.log("error", error);
  });

console.log(
  "Case 4-4:The path exists and is an absolute path to a directory. With options: validate y stats"
);
mdLinks("./testsMdLinks/folderParent", { validate: true, stats: true })
  .then((result) => {
    console.log("result-4-2", result);
  })
  .catch((error) => {
    console.log("error", error);
  });
