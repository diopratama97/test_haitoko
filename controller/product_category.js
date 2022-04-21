let response = require("../res");
let knex = require("../config/db/conn");
const { v4: uuidv4 } = require("uuid");
const { category, getOne, del } = require("../helper/validations");
require("dotenv").config();

exports.getAllCategory = async (req, res) => {
  try {
    const result = await knex("product_category")
      .select("*")
      .whereNull("deleted_at");
    response.ok(result, res);
  } catch (error) {
    response.err(error, res);
  }
};

exports.getOneCategory = async (req, res) => {
  try {
    const { id } = await getOne.validateAsync(req.params);

    const result = await knex("product_category")
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

exports.insertCategory = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;

    if (infoLogin.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      const { category_name } = await category.validateAsync(req.body);
      await knex("product_category").insert({
        id: uuidv4(),
        category_name: category_name,
        created_by: infoLogin.id,
      });
      response.ok("INSERT SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const loginInfo = req.cookies.userInfo;
    const { id } = await getOne.validateAsync(req.params);
    const { category_name } = await category.validateAsync(req.body);

    if (loginInfo.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      const getCategory = await knex("product_category")
        .select("id")
        .where("id", id)
        .whereNull("deleted_at")
        .first();

      if (!getCategory) {
        response.notFound(res);
      } else {
        await knex("product_category")
          .update({
            category_name: category_name,
            updated_by: loginInfo.id,
          })
          .where("id", id);

        response.ok("UPDATE SUCCESS", res);
      }
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const loginInfo = req.cookies.userInfo;
    const { id } = await del.validateAsync(req.params);

    if (loginInfo.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      const getCategory = await knex("product_category")
        .select("id")
        .where("id", id)
        .whereNull("deleted_at")
        .first();

      if (!getCategory) {
        response.notFound(res);
      } else {
        await knex("product_category")
          .update({
            deleted_at: new Date(),
            updated_by: loginInfo.id,
          })
          .where("id", id);
        response.ok("DELETE SUCCESS", res);
      }
    }
  } catch (error) {
    response.err(error, res);
  }
};
