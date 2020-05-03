const oorekaResults = require("./oorekaResults");
const oorekaVegetableParser = require("./oorekaVegetableParser");
// var system = require("system");

var vegetable;

async function loadData() {
  vegetable = process.argv[2];
  // console.log(vegetable);
  const vegetableURL = await oorekaResults.load(vegetable);
  var results = await oorekaVegetableParser.loadDataFromPage(vegetableURL);
  return new Promise((response) => {
    console.log(results);
    response(results);
  });
}
loadData();

module.exports = {
  loadData: loadData,
};
