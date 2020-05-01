const { scrap } = require("../lib/https.js");
const htmlparser2 = require("htmlparser2");
const util = require("util");

// async function loadpage() {
//   const result = await get(
//     "https://jardinage.ooreka.fr/plante/recherche?motsClefs=bourrache"
//   );
//   console.log(`result of LoadPage  ${result}`);
//   //   const parse = new Promise(async (resolve) => {});
//   return null;
// }

const parser = new htmlparser2.Parser(
  {
    onopentag(name, attribs) {
      if (name === "script" && attribs.type === "text/javascript") {
        console.log(`tage is : ${name},${util.inspect(attribs)}`);
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

function filterItems(arr, query) {
  return arr.filter(
    (el) => el.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );
}

async function test() {
  console.clear();
  var result = parser.write(
    await scrap(
      "https://jardinage.ooreka.fr/plante/recherche?motsClefs=bourrache"
    )
  );

  //   console.log(filterItems(result, "bourrache"));
  console.log(result);
  parser.end();
  console.log("coucou");
}

// loadpage();
test();
