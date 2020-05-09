const oorekaParser = require("./oorekaParser/oorekaParser");
const wikipediaParser = require("./wikipediaParser/wikipediaVegetableParser");
const jsonAction = require("./createAssociation");
const util = require("util");
const fs = require("fs");

async function createVegetable(vegetableInput, option) {
  switch (option) {
    case 1:
      await createAuto(vegetableInput);
      break;
    case 2:
      createManualy(vegetableInput);
      break;
    default:
      break;
  }
}

async function createManualy(vegetableInput) {
  var newVegetable = {
    name: vegetableInput.name,
    exposure: vegetableInput.exposure,
    family: vegetableInput.family,
  };
  await appendObject(newVegetable);
  await jsonAction.createAssociation(vegetableInput.name, []);
  return null;
}

async function createAuto(vegetableInput) {
  const family = await wikipediaParser.loadControler(vegetableInput);

  var characteristics = await oorekaParser.loadData(vegetableInput);

  var newVegetable = {
    name: vegetableInput,
    exposure: characteristics.exposure,
    family: family,
  };
  await appendObject(newVegetable);
  await jsonAction.createAssociation(vegetableInput, []);
  return null;
}

async function appendObject(obj) {
  var configFile = fs.readFileSync("./DB/vegetables.JSON", "utf8");
  var config = JSON.parse(configFile);
  config.vegetable.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync("./DB/vegetables.JSON", configJSON);
}

coucou = {
  name: "capucine",
  exposure: "semi-shade",
  family: "Blechnaceae",
};
createVegetable(coucou, 2);
