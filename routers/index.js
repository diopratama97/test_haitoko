"use strict";

//const verification = require('../middleware/verification');

module.exports = (app) => {
  const home = require("../controller/index");
  const auth = require("../controller/auth");
  const category = require("../controller/product_category");
  const product = require("../controller/product");
  //home
  app.route("/").get(home.index);

  //auth
  app.route("/auth/register").post(auth.registrasi);
  app.route("/auth/login").post(auth.login);
  app.route("/auth/logout").get(auth.Logout);
  app.route("/auth/refreshToken").get(auth.tokenRefresh);

  //list category
  app.route("/category").get(category.getAllCategory);
  app.route("/category/:id").get(category.getOneCategory);

  //list product
  app.route("/product").get(product.getAllProduct);
  app.route("/product/:id").get(product.getOneProduct);
};
