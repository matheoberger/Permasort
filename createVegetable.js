const oorekaParser = require("./oorekaParser/oorekaParser");
const wikipediaParser = require("./wikipediaParser/wikipediaVegetableParser");
const jsonAction = require("./createAssociation");
const { appendObject } = require("./getVegetables");
const util = require("util");
const fs = require("fs");

async function createVegetable(vegetableInput, option) {
  switch (option) {
    case 1:
      return await createAuto(vegetableInput);
      break;
    case 2:
      return await createManualy(vegetableInput);
      break; // add case with auto but manualy checked
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
  appendObject(JSON.stringify(newVegetable));
  jsonAction.createAssociation(vegetableInput.name, []);
  return null;
}

async function createAuto(vegetableInput) {
  const family = await wikipediaParser.loadControler(vegetableInput);
  var characteristics = await oorekaParser.loadData(vegetableInput);

  if (!family) {
    return ["error", "family", family];
  }
  if (family.includes("http")) {
    return ["error", "family", family];
  }
  if (!characteristics) {
    return ["error", "oorekaResults", "can't find this vegetable"];
  }
  var newVegetable = {
    name: vegetableInput,
    exposure: characteristics.exposure,
    family: family,
  };
  appendObject(newVegetable);
  jsonAction.createAssociation(vegetableInput, []);
  return ["success"];
}

// async function appendObject(obj) {
//   var configFile = fs.readFileSync("./DB/vegetables.JSON", "utf8");
//   var config = JSON.parse(configFile);
//   config.vegetable.push(obj);
//   var configJSON = JSON.stringify(config);
//   fs.writeFileSync("./DB/vegetables.JSON", configJSON);
// }

// coucou = {
//   name: "capucine",
//   exposure: "semi-shade",
//   family: "Blechnaceae",
// };
// createVegetable(coucou, 2);

module.exports = {
  createVegetable: createVegetable,
};
