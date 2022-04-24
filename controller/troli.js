require("dotenv").config();
let response = require("../res");
let knex = require("../config/db/conn");
const { v4: uuidv4 } = require("uuid");
const { troli, checkout, getOne, del } = require("../helper/validations");
const convertToarray = require("../helper/convertString");
const Xendit = require("xendit-node");
const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });

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
      .select("price", "stock")
      .where("id", product_id)
      .whereNull("deleted_at")
      .first();

    if (!getProduct) {
      return response.notFound(res, "Product not found");
    }

    if (amount > getProduct.stock) {
      return response.overAmount(res, "Amount exceed stock product!");
    }

    const checkProductTroli = await knex("troli")
      .select("id", "amount", "total")
      .where("product_id", product_id)
      .andWhere("created_by", infoLogin.id)
      .andWhere("status", "DRAFT")
      .first();

    if (!checkProductTroli) {
      const troliDatas = {
        id: uuidv4(),
        product_id: product_id,
        created_by: infoLogin.id,
        amount: amount,
        total: getProduct.price * amount,
      };
      await knex("troli").insert(troliDatas);
    } else {
      const updateTroli = {
        amount: checkProductTroli.amount + amount,
        total: checkProductTroli.total + amount * getProduct.price,
      };
      await knex("troli").update(updateTroli).where("id", checkProductTroli.id);
    }
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

    const { troli_Ids, payment_method, nominal } = await checkout.validateAsync(
      req.body
    );
    const idTrolis = convertToarray.stringToArray(troli_Ids, ",");

    const detailTroli = await knex("troli").select("*").whereIn("id", idTrolis);

    const builder = knex("product").select("*");

    let productCheck = [];
    let Discount = 0;
    for (let i = 0; i < detailTroli.length; i++) {
      const checkProduct = await builder
        .clone()
        .whereNull("deleted_at")
        .where("id", detailTroli[i].product_id)
        .first();

      if (!checkProduct) {
        productCheck.push(detailTroli[i].product_id);
      }
      if (checkProduct) {
        Discount += checkProduct.discount;
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

    if (payment_method == "CASH") {
      if (nominal < sumTotal[0].t) {
        return response.err("Payment less than total");
      }
    }

    if (payment_method == "CASH" && nominal == 0) {
      return response.err("Must be value if you choice payment method CASH!");
    }

    let totalDiscount = Discount != 0 ? Discount / 100 : 0;

    let responseXendit = {
      data: {
        expiry_date: null,
        available_banks: [{ bank_account_number: null }],
        external_id: null,
      },
    };

    const dataInvoiceXendit = {
      externalID: invoiceNoExt,
      amount: Discount != 0 ? sumTotal[0].t * totalDiscount : sumTotal[0].t,
      payerEmail: infoLogin.email,
      paymentMethods: [payment_method],
      description: `Test pembayaran haitoko`,
    };

    if (payment_method != "CASH") {
      const { Invoice } = xendit;
      const invoiceSpecificOptions = {};
      const invoice = new Invoice(invoiceSpecificOptions);

      responseXendit = await invoice.createInvoice(dataInvoiceXendit);
    }

    const dataInvoice = {
      id: uuidv4(),
      invoice_no: invoiceNo,
      invoice_date: new Date(),
      invoice_total:
        Discount != 0 ? sumTotal[0].t * totalDiscount : sumTotal[0].t,
      invoice_status: !payment_method
        ? "DRAFT"
        : payment_method == "CASH"
        ? "PAID"
        : "UNPAID",
      created_by: infoLogin.id,
      invoice_bank_info: payment_method == "CASH" ? "CASH" : payment_method,
      invoice_paid_at: payment_method == "CASH" ? new Date() : null,
      fee_nominal: payment_method == "CASH" ? nominal : null,
      fee_change:
        nominal >= sumTotal[0].t && Discount == 0
          ? nominal - sumTotal[0].t
          : nominal >= sumTotal[0].t && Discount != 0
          ? nominal - sumTotal[0].t * totalDiscount
          : null,
      invoice_no_ext: payment_method == "CASH" ? null : invoiceNoExt,
      invoice_url: payment_method == "CASH" ? null : responseXendit.invoice_url,
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
          status: !payment_method
            ? "DRAFT"
            : payment_method == "CASH"
            ? "PAID"
            : "UNPAID",
          invoice_id: dataInvoice.id,
        })
        .where("id", detailTroli[x].id);
    }

    return response.ok(
      {
        message: "INSERT SUCCESS",
        fee_change: payment_method == "CASH" ? dataInvoice.fee_change : null,
        invoice_url:
          payment_method == "CASH" ? null : responseXendit.invoice_url,
      },
      res
    );
  } catch (error) {
    return response.err(error.message, res);
  }
};

exports.callback = async (req, res) => {
  console.log(req.body);
  const getInvoice = await knex("invoice as i")
    .leftJoin("user as u", "u.id", "i.created_by")
    .select("i.id", "i.created_by", "i.invoice_no", "u.email", "u.name")
    .where("i.invoice_no_ext", req.body.external_id)
    .first();

  if (!getInvoice) {
    return response.notFound(res, "Invoice Not Found");
  }

  const getTroli = await knex("troli")
    .select("*")
    .where("invoice_id", getInvoice.id);

  for (let i = 0; i < getTroli.length; i++) {
    await knex("troli")
      .update({
        status: req.body.status === "PAID" ? "PAID" : "EXPIRED",
      })
      .where("id", getTroli[i].id);
  }

  const dataInvoice = {
    invoice_paid_at: req.body.status === "PAID" ? new Date() : null,
    invoice_status: req.body.status === "PAID" ? "PAID" : "EXPIRED",
  };

  await knex("invoice").update(dataInvoice).where("id", getInvoice.id);

  const dataXendit = {
    external_id: req.body.external_id,
    payment_method: req.body.payment_method,
    amount: req.body.amount,
    paid_amount: req.body.paid_amount,
    status: req.body.status,
    payment_channel: req.body.payment_channel,
    payment_destination: req.body.payment_destination,
  };

  return response.ok(dataXendit, res);
};
