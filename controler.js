const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});
var menu = require("./menu");
var action = require("./action");

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
