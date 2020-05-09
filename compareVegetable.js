const fs = require("fs");
const util = require("util");

async function extractInfoOf(vegetableInput) {
  var vegetableInputSpec;
  var similarVegetableInput = [];

  data = await readVegetableFile();

  for (var i = 0; i < data.vegetable.length; i++) {
    console.log("coucou");
    if (data.vegetable[i].name == vegetableInput) {
      if (!vegetableInputSpec) {
        console.log("matched");
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

  return vegetableInputSpec;
}
async function sortBestAssociations(object) {
  return this.associations;
}

async function readVegetableFile() {
  var configFile = fs.readFileSync("./DB/vegetables.JSON", "utf8");
  var config = JSON.parse(configFile);
  return config;
}

extractAssociations("persil");
