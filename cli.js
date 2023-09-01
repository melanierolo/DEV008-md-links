// CLI - show answers
const { mdLinks } = require("./index.js");
const yargs = require("yargs");

// Define the command using positional arguments and options
yargs.command(
  "$0 <path>",
  "Analyze links in a Markdown file",
  (yargs) => {
    return yargs
      .positional("path", {
        describe: "Path to the Markdown file or directory",
        type: "string",
      })
      .options({
        validate: {
          alias: "v",
          describe: "Validate the links",
          type: "boolean",
          demandOption: false,
        },
        stats: {
          alias: "s",
          describe: "Show statistics about the links",
          type: "boolean",
          demandOption: false,
        },
      });
  },
  (argv) => {
    const { path, validate, stats } = argv;
    console.log(path);
    // Call the mdLinks function with the provided path and options
    try {
      mdLinks(path, { validate: validate, stats: stats })
        .then((result) => {
          console.log("result", result);
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } catch (error) {
      console.error(error);
    }
  }
);

// Parse the command-line arguments
yargs.parse();
