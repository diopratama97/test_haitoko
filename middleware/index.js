const express = require("express");
const router = express.Router();
const verifikasi = require("./verification");

const user = require("../controller/users");
const category = require("../controller/product_category");
const product = require("../controller/product");
const troli = require("../controller/troli");
//const { upload } = require("../helper/upload");

//users
router.get("/users", verifikasi(), user.getAllUsers);
router.put("/users/:id", verifikasi(), user.updateUsers);
router.get("/users/:id", verifikasi(), user.getOneUsers);
router.delete("/users/:id", verifikasi(), user.deleteUsers);
router.post("/users/changepass", verifikasi(), user.changePassword);

//category
router.post("/category", verifikasi(), category.insertCategory);
router.put("/category/:id", verifikasi(), category.updateCategory);
router.delete("/category/:id", verifikasi(), category.deleteCategory);

//product
router.post("/product", verifikasi(), product.insertProduct);
router.put("/product/:id", verifikasi(), product.updateProduct);
router.delete("/product/:id", verifikasi(), product.deleteProduct);

//troli
router.get("/troli", verifikasi(), troli.getAllTroli);
router.get("/troli/:id", verifikasi(), troli.getOneTroli);
router.post("/troli", verifikasi(), troli.insertTroli);
router.put("/troli-update-amount/:id", verifikasi(), troli.updateAmount);
router.delete("/troli/:id", verifikasi(), troli.deleteTroli);
router.post("/troli-checkout", verifikasi(), troli.checkoutTroli);

module.exports = router;
