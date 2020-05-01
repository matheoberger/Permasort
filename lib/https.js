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
  return new Promise((resolve) => {
    exec(
      `"${__dirname}\\..\\executables\\phantomjs.exe" "${__dirname}\\..\\executables\\phantomHandler.js" "${url}"`,
      (err, stdout, stderr) => {
        if (err) throw err;
        resolve(stdout);
      }
    );
  });
}

module.exports = { get: get, scrap: scrap };
