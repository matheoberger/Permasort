const readline = require("readline");
const util = require("util");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

function visualInterface() {
  console.log("\033[2J");
  console.log("*********************************************");
  console.log("**   Welcome to the v1 permaculture sort   **");
  console.log("*********************************************");
  console.log(" ");
  console.log("   1) Sort all associations from a vegetable");
  console.log("   2) Add a vegetable");
  console.log("   3) Close app");
  console.log("   4) See variables");
}

function userInput() {
  return new Promise((response) => {
    takeInput((input) => {
      response(input);
    });
  });
}

async function addVegetable() {
  console.log("\033[2J");
  console.log("*********************************************");
  console.log("**             Add vegetable               **");
  console.log("*********************************************");

  console.log("--> name ?");
  this.name = await this.userInput();

  console.log("--> exposition ?");
  this.exposition = await this.userInput();

  console.log("--> association ? (format : vegetable name separate by , )");
  this.associations = await this.userInput();

  console.log(" ");
  console.log(`|   Name  : ${this.name}`);
  console.log(`|   Exposition  : ${this.exposition}`);
  console.log(`|   Associations  : ${this.associations}`);

  return new Promise((response) => {
    response(this);
  });
}

async function variableVue(variableList) {
  console.log("\033[2J");
  console.log("*********************************************");
  console.log("**             Variable list               **");
  console.log("*********************************************");
  console.log(`Vegetable list : ${util.inspect(variableList)}`);
  await this.userInput();
  return null;
}

async function sortVegetable(result) {
  if (result) {
    const doPrint = new Promise((resolve) => {
      console.log("here are all the posibilities : ");
      // setTimeout(() => {
      //   console.log(`result : ${util.inspect(result)}`);
      // }, 1000);
      result.forEach((element) => {
        console.log(` > ${element.name}`);
      });
      resolve();
    });
    await doPrint.then(async () => {
      await this.userInput();
    });
    return null;
  } else {
    console.log("\033[2J");
    console.log("*********************************************");
    console.log("**          Sort by vegetable              **");
    console.log("*********************************************");
    console.log("   Name the vegetable you want to sort");
    this.vegetableToSort = await this.userInput();
    return new Promise((response) => {
      response(this.vegetableToSort);
    });
  }
}

async function messageLog(logValue) {
  // console.log(`logvalue : ${logValue}`);
  switch (logValue) {
    case 1:
      console.log("This vegetable doesn't exist ! ");
      await this.userInput();
      break;
    case 2:
      console.log(" ! successfuly record !");
      await this.userInput();
      break;
    case 3:
      console.log("No result found");
      await this.userInput();
      break;
    default:
      break;
  }
  return null;
}

function takeInput(callback) {
  rl.on("line", (input) => {
    // console.log(`input : ${inp²²ut}`);
    callback(input);
  });
}

module.exports = {
  visualInterface: visualInterface,
  userInput: userInput,
  addVegetable: addVegetable,
  variableVue: variableVue,
  sortVegetable: sortVegetable,
  messageLog: messageLog,
};
