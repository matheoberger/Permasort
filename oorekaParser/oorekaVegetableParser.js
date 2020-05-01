const { scrap } = require("../lib/https");
const htmlparser2 = require("htmlparser2");

var show = false;
var next = "";
var tag = "";
const parser = new htmlparser2.Parser(
  {
    onopentag(name, attribs) {
      tag = name;
    },
    ontext(text) {
      text = text.replace(/\s+/g, "");
      if (text.length == 0) return;

      if (show) {
        console.log(next + text);
        show = false;
      }

      if (text == "Famille" && tag == "p") {
        show = true;
        next = "Famille : ";
      }
    },
    onclosetag(tagname) {},
  },
  { decodeEntities: true }
);

async function test() {
  console.log(
    parser.write(
      await scrap("https://jardinage.ooreka.fr/plante/voir/178/bourrache")
    )
  );
  parser.end();
}

test();
module.exports = {};
