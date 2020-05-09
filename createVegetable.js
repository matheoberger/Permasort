const oorekaParser = require("./oorekaParser/oorekaParser");
const wikipediaParser = require("./wikipediaParser/wikipediaVegetableParser");
const util = require("util");
const fs = require("fs");

async function createVegetable(vegetableInput) {
  const family = await wikipediaParser.loadControler(vegetableInput);

  var characteristics = await oorekaParser.loadData(vegetableInput);

  var newVegetable = {
    name: vegetableInput,
    exposition: characteristics.exposure,
    family: family,
  };
  await appendObject(newVegetable);
  return null;
}

async function appendObject(obj) {
  var configFile = fs.readFileSync("./DB/vegetables.JSON", "utf8");
  var config = JSON.parse(configFile);
  config.vegetable.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync("./DB/vegetables.JSON", configJSON);
}

createVegetable("persil");
