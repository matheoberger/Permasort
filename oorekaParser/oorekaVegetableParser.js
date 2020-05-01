const { get } = require("../lib/https");
const htmlparser2 = require("htmlparser2");

const parser = new htmlparser2.Parser(
  {
    onopentag(name, attribs) {
      console.log(name, attribs);
    },
    ontext(text) {
      console.log(text);
    },
    onclosetag(tagname) {},
  },
  { decodeEntities: true }
);

async function test() {
  console.log(
    //parser.write(
    await get("https://jardinage.ooreka.fr/plante/voir/178/bourrache")
    // )
  );
  parser.end();
}

test();
module.exports = {};
