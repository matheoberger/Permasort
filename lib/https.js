const https = require("https");
const { exec } = require("child_process");

function get(url) {
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        res.on("data", (d) => {
          resolve(d.toString());
        });
      })
      .on("error", (e) => {
        console.error(e);
      });
  });
}

function scrap(url) {
  console.log(__dirname);
  exec(
    `"${__dirname}\\..\\executables\\phantomjs.exe"`,
    (err, stdout, stderr) => {
      console.log(err);
      console.log(stdout);
    }
  );
}

scrap();
module.exports = { get: get, scrap: scrap };
