console.log("dirname");
console.log(__dirname);
const { scrap } = require("../lib/https.js");
const htmlparser2 = require("htmlparser2");
const util = require("util");

async function loadDataFromPage(URL) {
  var waterNeed;
  var exposure = [];
  var sizeType = [];
  var size;
  var density = [];
  var parseDensity;
  var allText;
  var allOpenTag;
  var stopWriting = false;
  const densityRegex = new RegExp(
    /(?<=Densité\s+)([ 0-9a-zA-Z/à]+)(?=(m²|m2))/,
    "g"
  );
  const sizeRegex = "[0-9,]+( à )[0-9,]+( m)";
  const HeightWidthRegex = "(Largeur)|(Hauteur)";
  const extractNumbersRegex = /[0-9,]+/g;

  const parser = new htmlparser2.Parser(
    {
      onopentag(name, attribs) {
        // console.log(name, attribs);
        if (!stopWriting) {
          allOpenTag += attribs.class;
        }
        if (attribs.class) {
          if (attribs.class == "w_1_3 liste_illustration") {
            stopWriting = true;
            // console.log("footer categorie exposure");
          }
        }

        if (name === "span" && attribs.class && !stopWriting) {
          if (attribs.class.includes("exposure_")) {
            if (attribs.class.includes("_soleil")) {
              exposure.push("sunny");
            } else if (attribs.class.includes("_mi_ombre")) {
              exposure.push("semi-shade");
            } else if (attribs.class.includes("_ombre")) {
              exposure.push("shade");
            }
            // console.log(`expo : ${exposure}`);
            // console.log(attribs.text);
          }
          if (attribs.class.includes("besoin_eau") && !waterNeed) {
            waterNeed = attribs.class.match("[a-zA-Z]+$")[0];
            // console.log(`waterNeed : ${waterNeed}`);
          }
        }
      },
      ontext(text) {
        allText += text;
        // if (text.match("sol+[a-z ]{8}")) {
        //   console.log(text);
        // }

        // console.log(text);
      },
      onclosetag(tagname) {},
    },
    { decodeEntities: true }
  );
  // console.log(
  const coucou = new Promise(async (resolve) => {
    parser.write(await scrap(URL));
    parser.end();
    // console.log("parser has been writed");
    resolve();
  });
  return new Promise(async (response) => {
    await coucou.then(() => {
      // console.log(allText);
      // console.log(allOpenTag);
      if (allText.match(densityRegex)) {
        density = allText.match(densityRegex)[0].match(/[0-9]+/);
      }
      if (allText.match("(Largeur)|(Hauteur)")) {
        sizeType.push(
          allText
            .match(HeightWidthRegex)[0]
            .replace("Largeur", "width")
            .replace("Hauteur", "height")
        );
      }
      if (allText.match(sizeRegex)) {
        var parseUnknowSize = allText
          .match(sizeRegex)[0]
          .match(extractNumbersRegex);
        size = parseUnknowSize;
        // console.log(size);
      }

      this.width = [];
      this.height = [];
      this.density = [];
      this.waterNeed = waterNeed;
      this.exposure = exposure;
      density.forEach((element) => {
        if (!isNaN(element)) {
          // console.log("This is a number");
          this.density.push(element);
        }
      });

      if (sizeType[0].includes("height")) {
        this.height.push(size[0]);
        this.width.push(size[1]);
      } else {
        this.width.push(size[0]);
        this.height.push(size[1]);
      }
    });
    wait = false;
    response(this);
  });
}

module.exports = {
  loadDataFromPage: loadDataFromPage,
};
