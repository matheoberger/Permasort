const getVegetables = require("./getVegetables");

async function getVegetable(vegetableInput) {
  var data = await getVegetables.getVegetables();
  var vegetableSpec;
  data.vegetable.forEach((element) => {
    if (element.name == vegetableInput) {
      vegetableSpec = element;
    }
  });
  return vegetableSpec;
}

module.exports = {
  getVegetable: getVegetable,
};
