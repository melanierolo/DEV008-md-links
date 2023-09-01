// CLI - show answers
const { mdLinks } = require("./index.js");
const yargs = require("yargs");
const chalk = require("chalk");

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
    // Colors:
    const colorBlueOne = chalk.hex("#4698F1");
    const colorBlueTwo = chalk.hex("#0D6CE8");
    const colorThree = chalk.hex("#703770");
    const colorError = chalk.hex("#D62237");
    const colorOk = chalk.hex("#58C94C");
    const colorFail = chalk.hex("#E65558");
    console.log(path);
    // Call the mdLinks function with the provided path and options
    try {
      mdLinks(path, { validate: validate, stats: stats })
        .then((result) => {
          if (typeof result[0]["Total"] === "number") {
            for (const [key, value] of Object.entries(result[0])) {
              console.log(colorBlueOne.bold(`${key} : `) + `${value}`);
            }
          } else if (Object.values(result[0]).length === 3) {
            result.forEach((element) => {
              console.log(
                `${element.file} ` +
                  colorBlueTwo.italic(`${element.href}`) +
                  colorThree(` ${element.text.slice(0, 50)}`)
              );
            });
          } else {
            result.forEach((element) => {
              console.log(
                `${element.file} ` +
                  colorBlueOne.italic(`${element.href}`) +
                  ` ${
                    element.ok === "OK"
                      ? colorOk.bold("OK" + ` ${element.status} `)
                      : colorFail.bold("FAIL" + ` ${element.status} `)
                  }` +
                  colorThree(`${element.text.slice(0, 50)}`)
              );
            });
          }
        })
        .catch((error) => {
          console.log(colorError.bold(error));
        });
    } catch (error) {
      console.log(colorError.bold(error));
    }
  }
);

// Parse the command-line arguments
yargs.parse();
