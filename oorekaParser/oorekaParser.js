const oorekaResults = require("./oorekaResults");
const oorekaVegetableParser = require("./oorekaVegetableParser");

async function loadData(vegetable) {
  const vegetableURL = await oorekaResults.load(vegetable);
  var results = await oorekaVegetableParser.loadDataFromPage(vegetableURL);
}

loadData("carotte");

module.exports = {};
