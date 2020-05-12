let express = require("express");
let bodyParser = require("body-parser");
let { getVegetable } = require("../getVegetable");
let { findAssociation } = require("../compareVegetable");
let { createVegetable } = require("../createVegetable");
let app = express();

//moteur de template
app.set("view engine", "ejs");

// Middleware
app.use("/assets/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/**
 * Check if association exist for a given vegetable, return association table or error message
 */
async function getAssociation() {}
