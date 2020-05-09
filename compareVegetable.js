const fs = require("fs");
const util = require("util");
const {
  getAssociations,
  modifyAssociation,
  appendObject,
} = require("./getAssociations");

async function findAssociation(vegetableInput) {
  var vegetableInputSpec;
  var similarVegetableInput;

  data = await readVegetableFile();

  for (var i = 0; i < data.vegetable.length; i++) {
    // console.log("coucou");
    if (data.vegetable[i].name == vegetableInput) {
      if (!vegetableInputSpec) {
        // console.log("matched");
        vegetableInputSpec = data.vegetable[i];
      } else {
        similarVegetableInput.push(data.vegetable[i]);
      }
    }
  }
  console.log(vegetableInputSpec);
  if (similarVegetableInput) {
    console.log("hey");
    console.log("they may be duplicate vegetable for the same name : ");
    similarVegetableInput.forEach((e) => {
      console.log(util.inspect(e));
    });
  }

  var associateVegetableName = [];
  var associateVegetables = [];

  var assoData = await getAssociations();
  assoData.associations.forEach((element) => {
    if (element.vegetable == vegetableInput) {
      element.vegetableAssociations.forEach((associationInput) => {
        associateVegetableName.push(associationInput);
      });
    }
  });
  associateVegetableName.forEach((element) => {
    data.vegetable.forEach((vegetable) => {
      if (element == vegetable.name) {
        associateVegetables.push(vegetable);
      }
    });
  });
  console.log(associateVegetableName);
  console.log(associateVegetables);
  var result = await sortBestAssociations(
    vegetableInputSpec,
    associateVegetables
  );

  var higherResult = 0;
  var sortResult = [];
  result.forEach((element) => {
    if (element[1] > higherResult) {
      higherResult = element[1];
    }
  });
  for (var i = higherResult; i >= 0; i--) {
    result.forEach((element) => {
      if (element[1] == i) {
        console.log(element[0].name + " :  " + element[1]);
        sortResult.push(element);
      }
    });
  }

  return sortResult;
}
async function sortBestAssociations(vegetable, associateVegetables) {
  var pointMatch = [];

  associateVegetables.forEach((element) => {
    var tempArr = [];
    tempArr.push(element);
    tempArr.push(0);
    var elementExpoStr;
    if (element.exposition) {
      element.exposition.forEach((expo) => {
        elementExpoStr += expo;
      });
    }
    var vegetableExpoStr;

    if (vegetable.exposition) {
      vegetable.exposition.forEach((expo) => {
        vegetableExpoStr += expo;
      });
    }

    if (elementExpoStr == vegetableExpoStr) {
      tempArr[1] += 2;
    } else {
      if (vegetableExpoStr.includes(elementExpoStr)) {
        tempArr[1] += 1;
      } else {
        if (elementExpoStr.includes(vegetableExpoStr)) {
          tempArr[1] += 1;
        }
      }
    }
    if (
      element.family &&
      vegetable.family &&
      element.family != vegetable.family
    ) {
      tempArr[1] += 2;
    }
    pointMatch.push(tempArr);
  });
  console.log(pointMatch);
  return pointMatch;
}

async function readVegetableFile() {
  var configFile = fs.readFileSync("./DB/vegetables.JSON", "utf8");
  var config = JSON.parse(configFile);
  return config;
}

findAssociation("persil").then((result) => {
  result.forEach((element) => {
    console.log(element);
  });
});
