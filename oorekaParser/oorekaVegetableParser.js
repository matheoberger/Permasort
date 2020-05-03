const { scrap } = require("../lib/https");
const htmlparser2 = require("htmlparser2");
const util = require("util");

async function loadDataFromPage(URL) {
  var waterNeed;
  var exposition;
  var sizeType = [];
  var size = [];
  var density = [];
  const parser = new htmlparser2.Parser(
    {
      onopentag(name, attribs) {
        // console.log(name, attribs);
        if (name === "span" && attribs.class) {
          if (attribs.class.includes("exposition_") && !exposition) {
            if (attribs.class.includes("_soleil")) {
              exposition = "sunny";
            } else if (attribs.class.includes("_mi_ombre")) {
              exposition = "semi-shade";
            } else if (attribs.class.includes("_ombre")) {
              exposition = "shade";
            }
            // console.log(`expo : ${exposition}`);
            // console.log(attribs.text);
          }
          if (attribs.class.includes("besoin_eau") && !waterNeed) {
            waterNeed = attribs.class.match("[a-zA-Z]+$")[0];
            // console.log(`waterNeed : ${waterNeed}`);
          }
        }
      },
      ontext(text) {
        // console.log(text);
        // if (text.match("sol+[a-z ]{8}")) {
        //   console.log(text);
        // }
        if (
          text.match(
            /[0-9]{1,3}[ a-z\/]{1,8}[2²]|[0-9]{1,3}( à )[0-9]{1,3}[ a-z\/]{1,8}[2²]/
          )
        ) {
          var parseDensity = [];
          parseDensity = text
            .match(
              /[0-9]{1,3}[ a-z\/]{1,8}[2²]|[0-9]{1,3}( à )[0-9]{1,3}[ a-z\/]{1,8}[2²]/
            )[0]
            .match(/[0-9,]+/g);
          density.push(parseDensity);
        }
        if (text.match("(Largeur)|(Hauteur)")) {
          sizeType.push(
            text
              .match("(Largeur)|(Hauteur)")[0]
              .replace("Largeur", "width")
              .replace("Hauteur", "height")
          );
        }
        if (text.match("[0-9,]+( à )[0-9,]+( m)")) {
          var parseUnknowSize = text
            .match(/[0-9,]+( à )[0-9,]+( m)/)[0]
            .match(/[0-9,]+/g);
          size.push(parseUnknowSize);
          // console.log(size);
        }
      },
      onclosetag(tagname) {},
    },
    { decodeEntities: true }
  );
  // console.log(
  const coucou = new Promise(async (resolve) => {
    parser.write(await scrap(URL));
    parser.end();
    resolve();
  });

  return new Promise(async (response) => {
    await coucou.then(() => {
      this.width = [];
      this.height = [];
      this.density = [];
      this.waterNeed = waterNeed;
      this.exposition = exposition;
      this.density = density;
      if (sizeType[0].includes("height")) {
        this.height.push(size[0]);
        this.width.push(size[1]);
      } else {
        this.width.push(size[0]);
        this.height.push(size[1]);
      }
    });
    response(this);
  });
}

module.exports = {
  loadDataFromPage: loadDataFromPage,
};
