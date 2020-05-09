const fs = require("fs");

async function createAssociation(vegetable, associations) {
  var data = await getAssociations();
  var newAssociation = [];
  var action;
  data.associations.forEach((element, i) => {
    if (element.vegetable == vegetable) {
      associations.forEach((associationInput) => {
        if (element.vegetableAssociations.includes(associationInput)) {
          console.log(
            `${vegetable} has been already associate with ${associationInput}`
          );
        } else {
          console.log("pushed " + associationInput);
          data.associations[i].vegetableAssociations.push(associationInput);
          action = 1;
        }
      });
    } else {
      if (!action) {
        action = 2;
      }
    }
  });
  switch (action) {
    case 1:
      modifyAssociation(data);
      break;
    case 2:
      console.log("new associations ! ");
      var tempObject = {
        vegetable: vegetable,
        vegetableAssociations: associations,
      };
      await appendObject(tempObject);
      break;
    default:
      break;
  }
}

async function getAssociations() {
  var configFile = fs.readFileSync("./DB/associations.JSON", "utf8");
  var config = JSON.parse(configFile);
  return config;
}
async function appendObject(obj) {
  var configFile = fs.readFileSync("./DB/associations.JSON", "utf8");
  var config = JSON.parse(configFile);
  console.log("config : " + config);
  config.associations.push(obj);
  var configJSON = JSON.stringify(config);
  fs.writeFileSync("./DB/associations.JSON", configJSON);
}
async function modifyAssociation(newData) {
  fs.writeFile(
    "./DB/associations.JSON",
    JSON.stringify(newData),
    function writeJSON(err) {
      if (err) return console.log(err);
    }
  );
}

// assoPersil = ["fève", "bourrache"];

// createAssociation("roquette", assoPersil);
