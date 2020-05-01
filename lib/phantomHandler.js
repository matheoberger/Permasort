"use strict";

var page = require("webpage").create(),
  server = "https://jardinage.ooreka.fr/plante/voir/62/oseille"; //,
//data = 'universe=expanding&answer=42';

page.open(server, function (status) {
  if (status !== "success") {
    throw "Unable to get webpage";
  } else {
    console.log(page.content);
  }

  phantom.exit();
});
