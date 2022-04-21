let response = require("../res");
let knex = require("../config/db/conn");
const { v4: uuidv4 } = require("uuid");
const { category, getOne, del } = require("../helper/validations");
require("dotenv").config();

exports.getAllCategory = async (req, res) => {
  try {
    const result = await knex("product_category")
      .select("*")
      .where("is_deleted", false);
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
      .andWhere("is_deleted", false)
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
    const userId = req.cookies.userId;
    const { category_name } = await category.validateAsync(req.body);
    await knex("product_category").insert({
      id: uuidv4(),
      category_name: category_name,
      created_at: new Date(),
      created_by: userId,
    });
    response.ok("INSERT SUCCESS", res);
  } catch (error) {
    response.err(error, res);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const { id } = await getOne.validateAsync(req.params);
    const { category_name } = await category.validateAsync(req.body);

    const getCategory = await knex("product_category")
      .select("id")
      .where("id", id)
      .andWhere("is_deleted", false)
      .first();

    if (!getCategory) {
      response.notFound(res);
    } else {
      await knex("product_category")
        .update({
          category_name: category_name,
          updated_by: userId,
        })
        .where("id", id);

      response.ok("UPDATE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const userId = req.cookies.userId;
    const { id } = await del.validateAsync(req.params);

    const getCategory = await knex("product_category")
      .select("id")
      .where("id", id)
      .andWhere("is_deleted", false)
      .first();

    if (!getCategory) {
      response.notFound(res);
    } else {
      await knex("product_category")
        .update({
          is_deleted: true,
          updated_by: userId,
        })
        .where("id", id);
      response.ok("DELETE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};
