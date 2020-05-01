const { scrap } = require("../lib/https.js");
const htmlparser2 = require("htmlparser2");
const util = require("util");

// var vegetable = "persil";
var path;

async function load(vegetable) {
  const parser = new htmlparser2.Parser(
    {
      // const regex = persil$;
      onopentag(name, attribs) {
        if (
          name === "a" &&
          attribs.class === "titre_liste_plante" &&
          attribs.href.match(`${vegetable}$`)
        ) {
          // console.log(`https://jardinage.ooreka.fr${attribs.href}`);
          path = `https://jardinage.ooreka.fr${attribs.href}`;
        }
      },
    },
    { decodeEntities: true }
  );

  console.clear();
  var result = parser.write(
    await scrap(
      `https://jardinage.ooreka.fr/plante/recherche?motsClefs=${vegetable}`
    )
  );
  parser.end();
  return path;
}

module.exports = {
  load: load,
};
