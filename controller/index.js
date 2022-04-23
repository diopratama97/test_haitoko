"use strict";

let response = require("../res");
exports.index = (req, res) => {
  return response.ok("SERVER BERJALAN!", res);
};
