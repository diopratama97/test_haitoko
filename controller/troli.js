let response = require("../res");
let knex = require("../config/db/conn");
const { v4: uuidv4 } = require("uuid");
const { troli, checkout, getOne, del } = require("../helper/validations");
const convertToarray = require("../helper/convertString");
require("dotenv").config();

exports.getAllTroli = async (req, res) => {
  try {
    let result;
    const infoLogin = req.cookies.userInfo;
    const builder = knex("troli").select("*");

    if (infoLogin.role == "Administrator") {
      result = await builder.clone();
    } else {
      result = await builder
        .clone()
        .where("status", "DRAFT")
        .andWhere("created_by", infoLogin.id);
    }
    response.ok(result, res);
  } catch (error) {
    response.err(error, res);
  }
};

exports.getOneTroli = async (req, res) => {
  try {
    let result;
    const { id } = await getOne.validateAsync(req.params);
    const infoLogin = req.cookies.userInfo;

    const builder = knex("troli").select("*").where("id", id);

    if (infoLogin.role == "Administrator") {
      result = await builder.clone().first();
    } else {
      result = await builder
        .clone()
        .andWhere("status", "DRAFT")
        .andWhere("created_by", infoLogin.id)
        .first();
    }

    if (!result) {
      response.notFound(res);
    } else {
      response.ok(result, res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.insertTroli = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;

    const { product_id, amount } = await troli.validateAsync(req.body);

    const getProduct = await knex("product")
      .select("price")
      .where("id", product_id)
      .whereNull("deleted_at")
      .first();

    if (!getProduct) {
      response.notFound(res, "Product not found");
    } else {
      const troliDatas = {
        id: uuidv4(),
        product_id: product_id,
        created_by: infoLogin.id,
        amount: amount,
        total: getProduct.price * amount,
      };
      await knex("troli").insert(troliDatas);
      response.ok("INSERT SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.updateAmount = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;
    const { id } = await getOne.validateAsync(req.params);
    const { product_id, amount } = await troli.validateAsync(req.body);

    const getTroli = await knex("troli")
      .select("created_by", "product_id")
      .where("id", id)
      .first();

    if (infoLogin.id != getTroli.created_by) {
      response.permissionDenied(res, "Permission Denied");
    }

    if (product_id != getTroli.product_id) {
      response.notFound(res, "Product not Found");
    }

    const checkProduct = await knex("product")
      .select("stock")
      .where("id", product_id)
      .whereNull("deleted_at")
      .first();

    if (checkProduct < amount) {
      response.overAmount(res, "Amount exceed stock product!");
    } else {
      await knex("troli")
        .update({
          amount: amount,
          updated_by: infoLogin.id,
        })
        .where("id", id);

      response.ok("UPDATE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.deleteTroli = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;
    const { id } = await del.validateAsync(req.params);

    const getTroli = await knex("troli")
      .select("created_by")
      .where("id", id)
      .first();

    if (infoLogin.id != getTroli.created_by) {
      response.permissionDenied(res, "Permission Denied");
    } else {
      await knex("troli").where("id", id).del();
      response.ok("DELETE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.checkoutTroli = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;

    const { troli_Ids } = await checkout.validateAsync(req.body);
    const idTrolis = convertToarray.stringToArray(troli_Ids, ",");

    const detailTroli = await knex("troli")
      .select("product_id")
      .whereIn("id", idTrolis);

    for (let i = 0; i < detailTroli.length; i++) {
      const checkProduct = await knex("product")
        .select("*")
        .where("id", detailTroli[i].product_id)
        .whereNull("deleted_at")
        .first();

      if (!checkProduct) {
        response.notFound(res, "Product not found");
      }
      console.log(checkProduct);
    }

    // if (!getProduct) {
    //   response.notFound(res, "Product not found");
    // } else {
    //   const troliDatas = {
    //     id: uuidv4(),
    //     product_id: product_id,
    //     created_by: infoLogin.id,
    //     amount: amount,
    //     total: getProduct.price * amount,
    //   };
    //   await knex("troli").insert(troliDatas);
    response.ok("INSERT SUCCESS", res);
    //}
  } catch (error) {
    response.err(error.message, res);
  }
};
