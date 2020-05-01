const https = require("https");

function get(url) {
  new Promise((resolve) => {
    https
      .get(url, (res) => {
        res.on("data", (d) => {
          resolve(d);
        });
      })
      .on("error", (e) => {
        console.error(e);
      });
  });
}

module.exports = { get: get };
