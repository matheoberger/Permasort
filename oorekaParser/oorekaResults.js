const { get } = require("../lib/https.js");
const htmlparser2 = require("htmlparser2");

async function loadpage() {
  const result = await get(
    "https://jardinage.ooreka.fr/plante/recherche?motsClefs=bourrache"
  );
  console.log(`result of LoadPage  ${result}`);
  //   const parse = new Promise(async (resolve) => {});
  return null;
}

const parser = new htmlparser2.Parser(
  {
    onopentag(name, attribs) {
      if (name === "script" && attribs.type === "text/javascript") {
        console.log("JS! Hooray!");
      }
    },
    ontext(text) {
      console.log("-->", text);
    },
    onclosetag(tagname) {
      if (tagname === "script") {
        console.log("That's it?!");
      }
    },
  },
  { decodeEntities: true }
);

async function test() {
  console.clear();
  console.log(
    parser.write(
      await get(
        "https://jardinage.ooreka.fr/plante/recherche?motsClefs=bourrache"
      )
    )
  );
  parser.end();
}

loadpage();
// test();
