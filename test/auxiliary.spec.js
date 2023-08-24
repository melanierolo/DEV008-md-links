const mdLinks = require("..");

const { getLinksStatusArray } = require("../auxiliary/auxiliary.js");

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
