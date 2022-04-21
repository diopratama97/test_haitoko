const express = require("express");
const router = express.Router();
const verifikasi = require("./verification");

const user = require("../controller/users");
const category = require("../controller/product_category");
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

module.exports = router;
