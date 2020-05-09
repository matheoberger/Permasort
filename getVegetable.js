const fs = require("fs");
async function getAssociations() {
  var configFile = fs.readFileSync("./DB/vegetable.JSON", "utf8");
  var config = JSON.parse(configFile);
  return config;
}
exports.getAssociations = getAssociations;
async function appendObject(obj) {
  var configFile = fs.readFileSync("./DB/vegetable.JSON", "utf8");
  var config = JSON.parse(configFile);
  console.log("config : " + config);
  config.associations.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync("./DB/vegetable.JSON", configJSON);
}
exports.appendObject = appendObject;
async function modifyAssociation(newData) {
  fs.writeFile(
    "./DB/vegetable.JSON",
    JSON.stringify(newData),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
}
exports.modifyAssociation = modifyAssociation;
