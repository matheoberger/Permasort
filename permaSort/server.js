let express = require("express");
let bodyParser = require("body-parser");
let { getVegetable } = require("../getVegetable");
// let { findAssociation } = require("../compareVegetable");
let { createVegetable } = require("../createVegetable");
// var partials = require("express-partials");
let app = express();

//moteur de template
app.set("view engine", "ejs");

// Middleware
app.use("/assets/", express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get("/", (request, response) => {
  response.render("pages/index", { test: "Salut" });
});

app.post("/", async (req, res) => {
  if (req.body.message) {
    console.log(`new user inpu : ${req.body.message}`);
    /**
     * Check if vegetable exist, return success or error message
     */
    await getVegetable(req.body.message).then(async (result) => {
      if (!result) {
        const result = await createVegetable(req.body.message, 1); //create auto vegetable
        console.log(`result : ${result}`);
        if (result[0].includes("error")) {
          res.render("/", function (err, html) {
            res.send(
              `<div>impossible to auto create the vegetable !</div><div>${
                result[0] + " " + result[1]
              }</div><a href="${
                result[2]
              }">click here to chose the right name</a>`
            );
          });
        } else {
          res.jsonp({ success: true });
          res.render("/", function (err, html) {
            res.send("<div>successfuly add this vegetable to database</div>");
          });
        }
      } else {
        return result;
      }
    });
  }
});

// app.post("/", async (request, response) => {
//   if (request.body.message == undefined || request.body.message == "") {
//     response.render("pages/header", {
//       error: "Vous n'avez pas rentré de message",
//     });
//     response.redirect("/");
//   } else {
//     await getVegetable.getVegetable(request.body.message).then((result) => {
//       this.result = result;
//     });
//     await findAssociation(request.body.message).then((associations) => {
//       console.log(`associations : ${associations}`);
//       response.render("pages/index", {
//         associations: associations,
//         result: this.result,
//         errVegetable:
//           "cette plante n'existe pas encore dans la base de données",
//       });
//     });
//   }
// });

app.listen(5000);
