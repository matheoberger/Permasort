const https = require("https");

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

module.exports = { get: get };
