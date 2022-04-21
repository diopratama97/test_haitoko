'use strict';

let response = require('../res');
exports.index = (req,res) => {
    response.ok("SERVER BERJALAN!",res);
}