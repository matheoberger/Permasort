const oorekaResults = require("./oorekaResults");

async function loadPage() {
  const pageLink = await oorekaResults.load("bourrache");
  console.log(pageLink);
}

loadPage();

module.exports = {};
