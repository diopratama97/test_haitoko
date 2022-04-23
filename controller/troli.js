let response = require("../res");
let knex = require("../config/db/conn");
const { v4: uuidv4 } = require("uuid");
const { troli, checkout, getOne, del } = require("../helper/validations");
const convertToarray = require("../helper/convertString");
const { createInvoice } = require("../helper/xendit");
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
    return response.ok(result, res);
  } catch (error) {
    return response.err(error, res);
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
      return response.notFound(res);
    } else {
      return response.ok(result, res);
    }
  } catch (error) {
    return response.err(error, res);
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
      return response.notFound(res, "Product not found");
    }

    const troliDatas = {
      id: uuidv4(),
      product_id: product_id,
      created_by: infoLogin.id,
      amount: amount,
      total: getProduct.price * amount,
    };
    await knex("troli").insert(troliDatas);
    return response.ok("INSERT SUCCESS", res);
  } catch (error) {
    return response.err(error, res);
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
      return response.permissionDenied(res, "Permission Denied");
    }

    if (product_id != getTroli.product_id) {
      return response.notFound(res, "Product not match in troli");
    }

    const checkProduct = await knex("product")
      .select("stock", "price")
      .where("id", product_id)
      .whereNull("deleted_at")
      .first();

    if (amount > checkProduct.stock) {
      return response.overAmount(res, "Amount exceed stock product!");
    }
    await knex("troli")
      .update({
        amount: amount,
        total: amount * checkProduct.price,
        updated_by: infoLogin.id,
      })
      .where("id", id);

    return response.ok("UPDATE SUCCESS", res);
  } catch (error) {
    return response.err(error, res);
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
      return response.permissionDenied(res, "Permission Denied");
    }
    await knex("troli").where("id", id).del();
    return response.ok("DELETE SUCCESS", res);
  } catch (error) {
    return response.err(error, res);
  }
};

exports.checkoutTroli = async (req, res) => {
  try {
    const infoLogin = req.cookies.userInfo;

    const { troli_Ids, payment_method } = await checkout.validateAsync(
      req.body
    );
    const idTrolis = convertToarray.stringToArray(troli_Ids, ",");

    const detailTroli = await knex("troli").select("*").whereIn("id", idTrolis);

    const builder = knex("product").select("*");

    let productCheck = [];
    for (let i = 0; i < detailTroli.length; i++) {
      const checkProduct = await builder
        .clone()
        .whereNull("deleted_at")
        .where("id", detailTroli[i].product_id)
        .first();

      if (!checkProduct) {
        productCheck.push(detailTroli[i].product_id);
      }
    }

    if (productCheck.length != 0) {
      const productEmpty = await builder.clone().whereIn("id", productCheck);
      return response.notFound(res, {
        message: "Product not found / is deleted",
        product: productEmpty,
      });
    }

    const invoiceNo = `INV-${new Date().getTime()}`;
    const invoiceNoExt = `${invoiceNo}0`;
    const sumTotal = await knex("troli")
      .sum("total as t")
      .whereIn("id", idTrolis);

    let responseXendit = {
      data: {
        expiry_date: null,
        available_banks: [{ bank_account_number: null }],
        external_id: null,
      },
    };

    if (payment_method != "CASH") {
      const dataInvoiceXendit = {
        externalID: invoiceNoExt,
        amount: sumTotal[0].t,
        payerEmail: infoLogin.email,
        paymentMethods: [payment_method],
        description: `Test Pembayaran Haitoko`,
      };

      responseXendit = await createInvoice(dataInvoiceXendit);
    }

    const dataInvoice = {
      id: uuidv4(),
      invoice_no: invoiceNo,
      invoice_date: new Date(),
      invoice_total: sumTotal[0].t,
      invoice_status: payment_method == "CASH" ? "PAID" : "UNPAID",
      created_by: infoLogin.id,
      invoice_no_ext: payment_method == "CASH" ? null : invoiceNoExt,
      invoice_bank_info: payment_method == "CASH" ? "CASH" : invoiceNoExt,
      invoice_paid_at: payment_method == "CASH" ? new Date() : null,
      invoice_url:
        payment_method == "CASH" ? null : responseXendit.data.invoice_url,
    };

    await knex("invoice").insert(dataInvoice);

    for (let x = 0; x < detailTroli.length; x++) {
      const detailInvoice = {
        id: uuidv4(),
        invoice_id: dataInvoice.id,
        product_id: detailTroli[x].product_id,
        amount: detailTroli[x].amount,
        total: detailTroli[x].total,
      };
      await knex("detail_invoice").insert(detailInvoice);
      await knex("troli")
        .update({
          status: payment_method == "CASH" ? "PAID" : "UNPAID",
        })
        .where("id", detailTroli[x].id);
    }

    return response.ok("INSERT SUCCESS", res);
  } catch (error) {
    return response.err(error.message, res);
  }
};

exports.callBack = async (req, res) => {
  try {
    let notificationBody;
    const getInvoice = await knex("invoice as i")
      .leftJoin("user as u", "u.id", "i.created_by")
      .select("i.id", "i.created_by", "i.invoice_no", "u.email", "u.name")
      .where("invoice_no_ext", req.body.external_id)
      .first();

    if (!getInvoice) {
      return response.notFound(res, "Invoice Not Found");
    }

    const dataInvoice = {
      invoice_paid_at: req.body.status === "PAID" ? new Date() : null,
      invoice_status: req.body.status === "PAID" ? "PAID" : "EXPIRED",
    };

    await knex("invoice").update(dataInvoice).where("id", getInvoice.id);

    // if (ctx.data.status === "PAID") {
    //   await ctx.moco.email.sendWithTemplate(
    //     "paymentSuccess",
    //     getInvoice.email,
    //     {
    //       name: getInvoice.name,
    //     }
    //   );
    // }

    const dataXendit = {
      external_id: req.body.external_id,
      payment_method: req.body.payment_method,
      amount: req.body.amount,
      paid_amount: req.body.paid_amount,
      status: req.body.status,
      payment_channel: req.body.payment_channel,
      payment_destination: req.body.payment_destination,
    };

    return (
      response.ok({
        code: "success",
        message: "callback success",
        data: dataXendit,
      }),
      res
    );
  } catch (error) {
    return response.err(error.message, res);
  }
};
