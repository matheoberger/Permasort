var menu = require("./menu");
const util = require("util");

class Vegetable {
  constructor(
    name,
    exposition,
    associations,
    color,
    size,
    properties,
    comestiblePart
  ) {
    this.name = name;
    this.exposition = exposition;
    this.color = color;
    this.size = size;
    this.properties = properties;
    this.comestiblePart = comestiblePart;
    this.associations = associations;
  }
}

var vegetableList = [];

async function sort() {
  var vegetableIndex;
  // var vegetableCompatibleList;
  const sort = new Promise(async (resolve) => {
    var vegetableToSort = await menu.sortVegetable();

    for (var i = 0; i < vegetableList.length; i++) {
      if (vegetableList[i].name === vegetableToSort) {
        vegetableIndex = i;
      }
    }
    if (isNaN(vegetableIndex)) {
      await menu.messageLog(1);
      resolve(null);
    } else {
      var vegetableCompatibleList = [];
      for (
        var i = 0;
        i < vegetableList[vegetableIndex].associations.length;
        i++
      ) {
        for (var ii = 0; ii < vegetableList.length; ii++) {
          if (
            vegetableList[vegetableIndex].associations[i] ==
            vegetableList[ii].name
          ) {
            vegetableCompatibleList.push(vegetableList[ii]);
          }
        }
      }
      resolve(vegetableCompatibleList);
    }
  });

  await sort.then(async (vegetableCompatibleList) => {
    // setTimeout(() => {
    //   console.log(vegetableCompatibleList);
    // }, 1000);
    if (vegetableCompatibleList) {
      await menu.sortVegetable(vegetableCompatibleList);
    } else await menu.messageLog(3);
  });
  return null;
}
async function addVegetable() {
  const result = await menu.addVegetable();

  const splitResult = new Promise((resolve) => {
    var parseResult = result.associations.split(",");
    resolve(parseResult);
  });
  await splitResult.then((parseResult) => {
    result.associations = parseResult;
  });

  const vegetable = new Vegetable(
    result.name,
    result.exposition,
    result.associations
  );

  const register = new Promise((logValue) => {
    vegetableList.push(vegetable);
    logValue(2);
  });
  await register.then(async (logValue) => {
    await menu.messageLog(2);
  });

  return null;
}

async function variableVue() {
  await menu.variableVue(vegetableList);
  return null;
}
async function registerToArray(vegetable, callback) {
  vegetableList.push(vegetable);
  await callback(2);
}

module.exports = {
  sort: sort,
  addVegetable: addVegetable,
  variableVue: variableVue,
};
