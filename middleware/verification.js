const jwt = require("jsonwebtoken");
require("dotenv").config();

function verification() {
  return function (req, rest, next) {
    //cek authorization header
    let tokenWithBearer = req.headers.authorization;
    if (tokenWithBearer) {
      let token = tokenWithBearer.split(" ")[1];
      //verifikasi
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return rest.status(401).send({
            auth: false,
            message: err,
          });
        } else {
          req.auth = decoded;
          next();
        }
      });
    } else {
      return rest.status(401).send({
        auth: false,
        message: "Token tidak tersedia",
      });
    }
  };
}
module.exports = verification;
