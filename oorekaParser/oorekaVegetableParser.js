const { get } = require("../lib/https");

async function test() {
  console.log(
    await get("https://jardinage.ooreka.fr/plante/voir/178/bourrache")
  );
}

test();
module.exports = {};
