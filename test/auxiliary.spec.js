const path = require("path");
const {
  isValidPath,
  convertToAbsPath,
  validateAbsolutePath,
} = require("../auxiliary/auxiliary.js");
const { getLinksStatusArray } = require("../auxiliary/auxiliary.js");
const {
  calculateStatistics,
  calculateBrokenLinks,
} = require("../auxiliary/auxiliary.js");

describe("Tests about paths", () => {
  it("Check if the path is valid", () => {
    const pathOne = "./noExiste";
    const pathTwo = "./../DEV008-md-links/testsMdLinks/folder/fileTwo.md";
    expect(isValidPath(pathOne)).toBe(false);
    expect(isValidPath(pathTwo)).toBe(true);
  });
});

describe("Convert relative paths to absolute paths", () => {
  it("should convert a relative path to an absolute path", () => {
    const relativePath = "./DEV008-md-links/testsMdLinks/folder/file.txt";
    const expectedAbsPath = path.resolve(relativePath);

    expect(convertToAbsPath(relativePath)).toBe(expectedAbsPath);
  });
});
describe("Tests to validate if the path is an absolute path", () => {
  it("It should return an absolute path to a file", () => {
    const relativePath = "./../DEV008-md-links/testsMdLinks/file.md";
    const expectedAbsPath =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md";

    expect(validateAbsolutePath(relativePath)).toBe(expectedAbsPath);
  });
  it("It should return an absolute path to a folder", () => {
    const relativePath = "./../DEV008-md-links/testsMdLinks/folder";
    const expectedAbsPath =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\folder";

    expect(validateAbsolutePath(relativePath)).toBe(expectedAbsPath);
  });
});

describe("Link Status", () => {
  it("It should return an array of objects, and each element should have the status of the link", () => {
    const arrayObjLinks = [
      {
        href: "https://marked.js.org/demo",
        text: "Demo",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
      },
      {
        href: "https://github.com/jsdom/jsdom",
        text: "JSDOM - Repository",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
      },
      {
        href: "https://github.com/jsdom/jsdom",
        text: "JSDOM - Repository",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
      },
      {
        href: "https://github.com/jsdom/jsdom/noExiteRuta",
        text: "JSDOM",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
      },
    ];

    return getLinksStatusArray(arrayObjLinks).then((data) => {
      expect(data).toStrictEqual([
        {
          file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
          href: "https://marked.js.org/demo",
          message: "OK",
          ok: "OK",
          status: 200,
          text: "Demo",
        },
        {
          file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
          href: "https://github.com/jsdom/jsdom",
          message: "OK",
          ok: "OK",
          status: 200,
          text: "JSDOM - Repository",
        },
        {
          file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
          href: "https://github.com/jsdom/jsdom",
          message: "OK",
          ok: "OK",
          status: 200,
          text: "JSDOM - Repository",
        },
        {
          file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
          href: "https://github.com/jsdom/jsdom/noExiteRuta",
          message: "Not Found",
          ok: "FAIL",
          status: 404,
          text: "JSDOM",
        },
      ]);
    });
  });
});

describe("Tests for Statistics of the Array of Link Objects", () => {
  it("It should return an object containing the count of total and unique links", () => {
    const arrayObjLinks = [
      {
        href: "https://github.com/jsdom/jsdom/noExiteRuta",
        text: "Marked",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "FAIL",
        status: 404,
        message: "Not Found",
      },
      {
        href: "https://github.com/markedjs/marked",
        text: "Marked - repository",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "OK",
        status: 200,
        message: "OK",
      },
      {
        href: "https://github.com/jsdom/jsdom/noExiteRuta",
        text: "JSDOM",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "FAIL",
        status: 404,
        message: "Not Found",
      },
      {
        href: "https://github.com/jsdom/jsdom/noExiteRuta",
        text: "JSDOM",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "FAIL",
        status: 404,
        message: "Not Found",
      },
    ];
    const result = [{ Total: 4, Unique: 2 }];

    expect(calculateStatistics(arrayObjLinks)).toEqual(result);
  });
  it("It should return an object containing the count of broken links", () => {
    const arrayObjLinks = [
      {
        href: "https://github.com/jsdom/jsdom/noExiteRuta",
        text: "JSDOM",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "FAIL",
        status: 404,
        message: "Not Found",
      },
      {
        href: "https://github.com/markedjs/marked",
        text: "Marked - repository",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "OK",
        status: 200,
        message: "OK",
      },
      {
        href: "https://github.com/jsdom/jsdom/noExiteRuta",
        text: "JSDOM",
        file: "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
        ok: "FAIL",
        status: 404,
        message: "Not Found",
      },
    ];
    const result = [{ Broken: 2 }];

    expect(calculateBrokenLinks(arrayObjLinks)).toEqual(result);
  });
});
