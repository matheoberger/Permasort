const { scrap } = require("../lib/https.js");
const htmlparser2 = require("htmlparser2");
const util = require("util");

var path;
var vegetable;

async function load(vegetableInput) {
  vegetable = vegetableInput;
  const parser = new htmlparser2.Parser(
    {
      onopentag(name, attribs) {
        // console.log(name, attribs);
        // console.log(vegetable);
        var value = "titre_liste";
        if (name == "a" && attribs.href && attribs.class) {
          if (
            attribs.class.includes(value) &&
            attribs.href.match(`${vegetable}$`)
          ) {
            path = `https://jardinage.ooreka.fr${attribs.href}`;
          }
        }
      },
      ontext(text) {
        // console.log(text);
      },
      onclosetag(tagname) {
        // console.log(tagname);
      },
    },
    { decodeEntities: true }
  );

  console.clear();
  // console.log(`vegetable : ${vegetable}`);

  const doParse = new Promise(async (resolve) => {
    parser.write(
      await scrap(
        `https://jardinage.ooreka.fr/plante/recherche?motsClefs=${vegetableInput}`
      )
    );
    parser.end();
    resolve();
  });

  parser.end();
  return new Promise(async (response) => {
    await doParse;
    response(path);
  });
}

module.exports = {
  load: load,
};

// const aze = new Promise(() => {
//   doStuff;
// });

// await aze.then(() => {
//   doNextStuff;
// });
