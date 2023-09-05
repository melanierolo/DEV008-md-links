const fs = require("fs");
const path = require("path");
const {
  isValidPath,
  convertToAbsPath,
  validateAbsolutePath,
  isFolder,
  hasMdFileExtension,
} = require("../auxiliary/auxiliary.js");
const {
  getLinksStatusArray,
  readContentDirectory,
} = require("../auxiliary/auxiliary.js");
const {
  calculateStatistics,
  calculateBrokenLinks,
} = require("../auxiliary/auxiliary.js");

describe("Tests about paths", () => {
  it("Check if the path is valid", () => {
    const pathOne = "./noExiste";
    const pathTwo =
      "./../DEV008-md-links/testsMdLinks/folderParent/fileParentOne.md";
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
  it("It should return an absolute path as the output, because the input is also an absolute path.", () => {
    const relativePath =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\folder";
    const expectedAbsPath =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\folder";

    expect(validateAbsolutePath(relativePath)).toBe(expectedAbsPath);
  });
});

describe("Tests to validate if the path is a folder", () => {
  it("It should return true whether it's a folder", () => {
    const absPath =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks";
    expect(isFolder(absPath)).toBe(true);
  });
  it("It should return false whether it is a file", () => {
    const absPath =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md";
    expect(isFolder(absPath)).toBe(false);
  });
});

describe("Tests to verify whether the file extension is '.md'.", () => {
  it("It should return 'true' if the file has an '.md' file extension.", () => {
    const absPathFile =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md";
    expect(hasMdFileExtension(absPathFile)).toBe(true);
  });
  it("It should return 'false' if the file hasn't an '.md' file extension.", () => {
    const absPathFile =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.txt";
    expect(hasMdFileExtension(absPathFile)).toBe(false);
  });
});

/* --------------------- Read Content Directiory --------------------- */
describe("Directory Content Reader Function", () => {
  beforeEach(() => {
    // Mock the fs.readdirSync method
    // jest.spyOn: temporarily replace the original function with a mock implementation
    jest.spyOn(fs, "readdirSync");
  });

  /* afterEach block is to ensure that any modifications made to the original functions using jest.spyOn() do not affect subsequent test cases.
  It helps maintain a clean and isolated testing environment for each test case*/
  afterEach(() => {
    // Restore the original fs.readdirSync method
    jest.restoreAllMocks();
  });

  it("should return an array of file paths in the directory", () => {
    // Define a temporary directory for testing
    const fakeDirectory =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks";

    // Define an array of absolute paths of file names in the directory
    const absPathOfFiles = [
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.md",
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\file.txt",
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\folderFiles",
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\folderParent",
    ];

    // Mock the fs.readdirSync method to return the list of absolute paths of the files
    fs.readdirSync.mockReturnValue(absPathOfFiles);

    // Call the function and get the result
    const result = readContentDirectory(fakeDirectory);

    // Expect that fs.readdirSync was called with the fake directory
    expect(fs.readdirSync).toHaveBeenCalledWith(fakeDirectory);

    // Expect that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Expect that the result contains the correct file paths
    const expectedPaths = absPathOfFiles.map((absPathOfFile) =>
      path.join(fakeDirectory, absPathOfFile)
    );
    expect(result).toEqual(expectedPaths);
  });

  it("should handle an empty directory", () => {
    const emptyDirectory =
      "C:\\Users\\Usuario\\Documents\\Labo\\Proyectos\\4-dev008--md-links\\DEV008-md-links\\testsMdLinks\\fake";
    fs.readdirSync.mockReturnValue([]);
    const result = readContentDirectory(emptyDirectory);

    // Expect that fs.readdirSync was called with the empty directory
    expect(fs.readdirSync).toHaveBeenCalledWith(emptyDirectory);

    // Expect that the result is an empty array
    expect(result).toEqual([]);
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

describe("readContentDirectory", () => {
  it("should return an array of file paths in the directory", () => {
    // Define a temporary directory for testing
    const fakeDirectory = "/fake/directory";

    // Define an array of file names in the directory
    const files = ["file1.txt", "file2.txt", "file3.txt"];

    // Mock the fs.readdirSync method to return the list of files
    jest.spyOn(fs, "readdirSync").mockReturnValue(files);

    // Call the function and get the result
    const result = readContentDirectory(fakeDirectory);

    // Expect that fs.readdirSync was called with the fake directory
    expect(fs.readdirSync).toHaveBeenCalledWith(fakeDirectory);

    // Expect that the result is an array
    expect(Array.isArray(result)).toBe(true);

    // Expect that the result contains the correct file paths
    const expectedPaths = files.map((fileName) =>
      path.join(fakeDirectory, fileName)
    );
    expect(result).toEqual(expectedPaths);
  });

  it("should handle an empty directory", () => {
    // Define an empty directory path
    const emptyDirectory = "/empty/directory";

    // Mock the fs.readdirSync method to return an empty array
    jest.spyOn(fs, "readdirSync").mockReturnValue([]);

    // Call the function and get the result
    const result = readContentDirectory(emptyDirectory);

    // Expect that fs.readdirSync was called with the empty directory
    expect(fs.readdirSync).toHaveBeenCalledWith(emptyDirectory);

    // Expect that the result is an empty array
    expect(result).toEqual([]);
  });

  it("should handle an error when reading the directory", () => {
    // Define a directory path that causes an error
    const errorDirectory = "/error/directory";

    // Mock the fs.readdirSync method to throw an error
    jest.spyOn(fs, "readdirSync").mockImplementation(() => {
      throw new Error("Directory read error");
    });

    // Expect that calling the function throws an error
    expect(() => readContentDirectory(errorDirectory)).toThrowError(
      "Directory read error"
    );
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
