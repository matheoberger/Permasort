const fs = require("fs");
async function getVegetables() {
  var configFile = fs.readFileSync("../DB/vegetables.JSON", "utf8");
  var config = JSON.parse(configFile);
  return config;
}
exports.getVegetables = getVegetables;
async function appendObject(obj) {
  var configFile = fs.readFileSync("../DB/vegetables.JSON", "utf8");
  var config = JSON.parse(configFile);
  // console.log("config : " + config);
  config.vegetable.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync("../DB/vegetables.JSON", configJSON);
}
exports.appendObject = appendObject;
async function modifyAssociation(newData) {
  fs.writeFile(
    "../DB/vegetables.JSON",
    JSON.stringify(newData),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
}
exports.modifyAssociation = modifyAssociation;
