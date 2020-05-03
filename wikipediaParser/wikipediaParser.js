/*
    pageprops.js
    MediaWiki API Demos
    Demo of `Pageprops` module: Get various properties defined in the page content
    MIT License
*/
const fetch = require("node-fetch");
const util = require("util");

console.clear();

var url = "https://en.wikipedia.org/w/api.php";

var params = {
  action: "query",
  titles: "Albert Einstein",
  prop: "pageprops",
  format: "json",
};

url = url + "?origin=*";
Object.keys(params).forEach(function (key) {
  url += "&" + key + "=" + params[key];
});

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });