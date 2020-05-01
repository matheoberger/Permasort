const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
var menu = require("./menu");
var action = require("./action");

// readline.question("Vegetable name", (name) => {
//   readline.close();
// });

// function Associations(input, association_table) {
//   for (var i = 0; i <= association_table; i++) {
//     if (input.name == association_table[i]) {
//       console.log(association_table[i]);
//     }
//   }
// }

// var coucou = readline();

// let oseille = new Vegetable();
// oseille.name = "oseille";
// oseille.exposition = "mos";
// oseille.size = "20";
// oseille.color = "green";
// oseille.comestible_part = "feuille";
// oseille.properties = "gustatory";

// console.log(oseille);

async function menuInput() {
  do {
    menu.visualInterface();
    this.input = await menu.userInput();
    switch (this.input) {
      case "1":
        await action.sort();
        break;
      case "2":
        await action.addVegetable();
        break;
      case "4":
        await action.variableVue();
        break;
      case "3":
        break;
      default:
        menu.visualInterface;
    }
  } while (this.input !== "3");
  process.exit();
}

menuInput();

// const test_visualInterface = new Promise(function () {
//   menu.visualInterface();
// });

// test_visualInterface.then(function (value) {
//   console.log(`the value is : ${value}`);
//   // expected output: "Success!"
// });
