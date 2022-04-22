let response = require("../res");
let knex = require("../config/db/conn");
const { v4: uuidv4 } = require("uuid");
const { product, getOne, del } = require("../helper/validations");
require("dotenv").config();

exports.getAllProduct = async (req, res) => {
  try {
    const result = await knex("product").select("*").whereNull("deleted_at");
    response.ok(result, res);
  } catch (error) {
    response.err(error, res);
  }
};

exports.getOneProduct = async (req, res) => {
  try {
    const { id } = await getOne.validateAsync(req.params);

    const result = await knex("product")
      .select("*")
      .where("id", id)
      .whereNull("deleted_at")
      .first();
    if (!result) {
      response.notFound(res);
    } else {
      response.ok(result, res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.insertProduct = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;

    if (infoLogin.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      const { product_name, category_id, stock, price, discount } =
        await product.validateAsync(req.body);

      const checkCategory = await knex("product_category")
        .select("id")
        .where("id", category_id)
        .whereNull("deleted_at")
        .first();

      if (!checkCategory) {
        response.notFound(res, "Category not found");
      } else {
        await knex("product").insert({
          id: uuidv4(),
          product_name: product_name,
          category_id: category_id,
          stock: stock,
          price: price,
          discount: discount,
          created_by: infoLogin.id,
        });
        response.ok("INSERT SUCCESS", res);
      }
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;
    const { id } = await getOne.validateAsync(req.params);
    const { product_name, category_id, stock, price, discount } =
      await product.validateAsync(req.body);

    if (infoLogin.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      const checkCategory = await knex("product_category")
        .select("id")
        .where("id", category_id)
        .whereNull("deleted_at")
        .first();

      if (!checkCategory) {
        response.notFound(res, "Category not found");
      } else {
        await knex("product")
          .update({
            product_name: product_name,
            category_id: category_id,
            stock: stock,
            price: price,
            discount: discount,
            updated_by: infoLogin.id,
          })
          .where("id", id);

        response.ok("UPDATE SUCCESS", res);
      }
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;
    const { id } = await del.validateAsync(req.params);

    if (infoLogin.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      const getProduct = await knex("product")
        .select("id")
        .where("id", id)
        .whereNull("deleted_at")
        .first();

      if (!getProduct) {
        response.notFound(res, "Product not found");
      } else {
        await knex("product")
          .update({
            deleted_at: new Date(),
            updated_by: infoLogin.id,
          })
          .where("id", id);
        response.ok("DELETE SUCCESS", res);
      }
    }
  } catch (error) {
    response.err(error, res);
  }
};
