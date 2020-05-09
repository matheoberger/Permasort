const oorekaResults = require("./oorekaResults");
const oorekaVegetableParser = require("./oorekaVegetableParser");
// var system = require("system");

var vegetable;
async function loadData(vegetableInput) {
  vegetable = process.argv[2];
  const vegetableURL = await oorekaResults.load(vegetableInput);
  var results = await oorekaVegetableParser.loadDataFromPage(vegetableURL);
  return new Promise((response) => {
    // console.log(results);
    response(results);
  });
}

module.exports = {
  loadData: loadData,
};
