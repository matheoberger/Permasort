const htmlparser2 = require("htmlparser2");
const util = require("util");
const https = require("https");
var fs = require("fs");

var allText;
var allTextFamily;
var textPage = [];
var altPage = [];
var newVegetableName;
var familyRegex = new RegExp(/famille\s+des\s+([a-z A-Zéèëê]+)/, "i");
// var hrefRegex = new RegExp(/href\W+([/a-zA-Z]+)/, "i");
var newVegetableNameRegex = new RegExp(/REDIRECTION\W+([a-zA-Z ]+)/, "i");
var homonymyRegex = new RegExp(/(Cette page d'homonymie)/, "i");
var newFamilyRegex = new RegExp(/(Rediriger vers)\W+([a-zA-Z]+)/, "i");

const parser = new htmlparser2.Parser(
  {
    onopentag(name, attribs) {
      // tagPage += name + attribs.class;
      if (attribs.alt) {
        altPage.push(attribs.alt);
      }
    },
    ontext(text) {
      allText += text;
      textPage.push(text);
    },
    onclosetag(tagname) {
      // console.log(tagname);
    },
  },
  { decodeEntities: true }
);
const rawFamilyParser = new htmlparser2.Parser(
  {
    onopentag(name, attribs) {
      // tagPage += name + attribs.class;
      // if (attribs.alt) {
      //   altPage.push(attribs.alt);
      // }
    },
    ontext(text) {
      allTextFamily += text;
      // textPage.push(text);
    },
    onclosetag(tagname) {
      // console.log(tagname);
    },
  },
  { decodeEntities: true }
);

async function loadControler(vegetableInput) {
  // const result = await parseDataToFamily(loadInfobox(vegetableInput), "1");
  console.log("search family name");
  const isAmbig = await disambiguation(vegetableInput);
  if (isAmbig) {
    return null;
  }
  var preresult = await loadInfobox(vegetableInput);
  if (preresult) {
    var result = await parseDataToRawFamily(preresult, "1");
    // console.log(result);
    if (!result) {
      preresult = await loadPage(vegetableInput);
      result = await parseDataToRawFamily(preresult, "2");
    }
    return await formatFamily(result).then((rightFamily) => {
      if (rightFamily) {
        return rightFamily;
      } else return null;
    });
  } else {
    console.log("There could be some homonymies");
    return null;
  }
}

async function disambiguation(vegetable) {
  const result = await request(
    `https://fr.wikipedia.org/w/api.php?action=query&titles=${vegetable}&prop=pageprops&ppprop=disambiguation&format=json`
  );
  if (result.match("disambiguation")) {
    console.log("ambig");
    return true;
  }
  return false;
}

async function request(URL) {
  const load = new Promise(async (resolve) => {
    https.get(URL, (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", () => {
        console.log(" get all data from :" + URL);
        data = data.replace(/(\\u2019)/g, "'");
        resolve(data);
      });
    });
  });
  return await load.then((data) => {
    if (data.match(homonymyRegex)) {
      console.log("STOP, THERE ARE HOMONYMIES");
      var allRegexMatch = [];
      allRegexMatch = data.match(homonymyRegex);
      console.log(allRegexMatch);
      //display on a div the link to the page to select the right name of vegetable
      return;
    } else {
      console.log(" no homonymies");
      // console.log(data);
      return data;
    }
  });
}

async function loadInfobox(vegetableInput) {
  var infobox = await request(
    `https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles=${vegetableInput}&rvprop=content&rvsection=0&callback=parseWiki`
  );
  if (infobox) {
    if (infobox.includes("REDIRECTION")) {
      console.log("redirect");
      newVegetableName = infobox.match(newVegetableNameRegex);
      newVegetableName = newVegetableName[1].replace(" ", "_");
      var infobox = await request(
        `https://fr.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&titles=${newVegetableName}&rvprop=content&rvsection=0&callback=parseWiki`
      );
    }
    return infobox;
  } else return null;
}

async function loadPage(vegetableInput) {
  var page;
  if (newVegetableName) {
    console.log("auto redirect to right page");
    page = await request(
      `https://fr.wikipedia.org/w/api.php?action=parse&page=${newVegetableName}&prop=text&format=json`
    );
  } else {
    page = await request(
      `https://fr.wikipedia.org/w/api.php?action=parse&page=${vegetableInput}&prop=text&format=json`
    );
  }

  return page;
}

async function parseDataToRawFamily(webElement, step) {
  var family;
  switch (step) {
    case "1":
      if (webElement) {
        rawData = JSON.stringify(webElement).replace(/[|]/g, "");
        if (rawData.match(/(famille  )([a-zA-Z]+)/)) {
          console.log(" MATCHED !");
          family = rawData.match(/(famille  )([a-zA-Z]+)/)[2];
        }
      }
      break;
    case "2":
      console.log(" writing...");
      parser.write(webElement);
      console.log(" closing parser");
      parser.end();
      console.log(allText);
      allText = allText.replace(/(\\u00e9)/g, "é");
      if (allText.match(familyRegex)) {
        console.log(" MATCHED !");
        console.log(allText.match(familyRegex));
      }
      break;
    default:
      console.log("Nothing to parse");
  }
  return family;
}

async function formatFamily(rawFamily) {
  console.log("verify family name");
  const loadAndFormat = new Promise(async function (resolve) {
    var newFamilyName;
    var result;
    var families;
    result = await request(
      `https://fr.wikipedia.org/w/api.php?action=parse&page=${rawFamily}&prop=text&format=json`
    );
    // console.log(`result : ${result}`);
    console.log(" writing...");
    rawFamilyParser.write(result);
    console.log(" closing parser");
    rawFamilyParser.end();
    // console.log(allTextFamily);
    if (allTextFamily.match(newFamilyRegex)) {
      newFamilyName = allTextFamily.match(newFamilyRegex)[2];
    } else {
      newFamilyName = rawFamily;
    }
    await loadFamilies().then((families) => {
      if (families.includes(newFamilyName)) {
        // console.log("this family exist : " + newFamilyName);
        resolve(newFamilyName);
      } else {
        // console.log("this family doesn't exist !");
        resolve(false);
      }
    });
  });
  const final = await loadAndFormat;
  return final;
} //convertir la famille trouvée en une famille formatée en latin

async function loadFamilies() {
  return new Promise((resolve) => {
    fs.readFile("./familiesArray.txt", "utf8", (err, data) => {
      if (err) {
        console.log(err);
      }
      resolve(data);
    });
  });
  // return await load;
}

async function ParseFamilies() {
  var file = fs.createWriteStream("familiesArray.txt");

  var allFamiliesRaw = [];
  var allFamilies = [];

  const read = new Promise((resolve) => {
    fs.readFile("./allFamiliesRaw.txt", "utf8", (err, data) => {
      // data = data.replace("<option", "\\n");
      allFamiliesRaw = data.match(/>([a-zA-Z]+)/g);
      allFamiliesRaw.forEach((e) => {
        allFamilies.push(e.replace(">", ""));
      });
      console.log(allFamilies);
      resolve();
    });
  });
  await read.then(() => {
    file.on("error", function (err) {
      /* error handling */
    });
    allFamilies.forEach(function (v) {
      file.write(v + "\n");
    });
    file.end();
  });
  return;
}

loadControler("carotte").then((data) => {
  console.log("--> " + data);
});

module.exports = {};
