const Xendit = require("xendit-node");
const xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

exports.callback = async (ctx) => {
  try {
    let notificationBody;
    const getInvoice = await ctx.moco.tables
      .knex("invoice as i")
      .leftJoin("users as u", "u.id", "i.created_by")
      .select(
        "i.id",
        "i.created_by",
        "i.invoice_no",
        "i.monulis_books_id",
        "u.email",
        "u.name"
      )
      .where("invoice_no_ext", ctx.data.external_id)
      .first();

    if (!getInvoice) {
      return {
        data: {
          code: 404,
          message: "Invoice Not Found",
        },
      };
    }

    if (getInvoice.monulis_books_id) {
      const getBook = await ctx.moco.tables
        .knex("monulis_books as mb")
        .leftJoin("books as b", "b.id", "mb.books_id")
        .select("b.book_title")
        .where("mb.id", getInvoice.monulis_books_id)
        .first();

      notificationBody =
        ctx.data.status === "PAID"
          ? `Selamat pembayaran untuk pembelian buku ${getBook.book_title} berhasil dilakukan, Terima kasih.`
          : `Pembayaran untuk buku ${getBook.book_title} telah kadaluarsa.`;
    }
    if (!getInvoice.monulis_books_id) {
      notificationBody =
        ctx.data.status === "PAID"
          ? "Selamat pembayaran untuk berlangganan di Moonulis berhasil dilakukan. Terima kasih."
          : "Pembayaran untuk berlangganan di Moonulis telah kadaluarsa.";
    }

    const dataInvoice = {
      invoice_paid_at:
        ctx.data.status === "PAID" ? new Date().toISOString() : null,
      invoice_status: ctx.data.status === "PAID" ? "PAID" : "EXPIRED",
    };

    const dataPayment = {
      payment_paid_at: ctx.data.status === "PAID" ? new Date() : null,
      payment_status: ctx.data.status === "PAID" ? "PAID" : "EXPIRED",
    };

    await ctx.moco.tables.update({
      table: "invoice",
      id: getInvoice.id,
      data: dataInvoice,
      event: true,
    });

    await ctx.moco.tables
      .knex("payment")
      .update(dataPayment)
      .where("invoice_id", getInvoice.id);

    const notifPayment = {
      id: uuidv4(),
      notification: notificationBody,
      notification_for: getInvoice.created_by,
      notification_type:
        ctx.data.status === "PAID" ? "PAYMENT_SUCCESS" : "PAYMENT_EXPIRED",
      info: JSON.stringify({
        invoice_id: getInvoice.id,
        invoice_no: getInvoice.invoice_no,
        invoice_amount: ctx.data.paid_amount,
      }),
    };
    await ctx.moco.tables.knex("monulis_notifications").insert(notifPayment);

    if (ctx.data.status === "PAID") {
      await ctx.moco.email.sendWithTemplate(
        "paymentSuccess",
        getInvoice.email,
        {
          name: getInvoice.name,
        }
      );
    }

    const dataXendit = {
      external_id: ctx.data.external_id,
      payment_method: ctx.data.payment_method,
      amount: ctx.data.amount,
      paid_amount: ctx.data.paid_amount,
      status: ctx.data.status,
      payment_channel: ctx.data.payment_channel,
      payment_destination: ctx.data.payment_destination,
    };

    return { code: "success", message: "callback success", data: dataXendit };
  } catch (error) {
    throw error;
  }
};

exports.createInvoice = async (datas) => {
  try {
    const { Invoice } = xendit;
    const invoiceSpecificOptions = {};
    const invoice = new Invoice(invoiceSpecificOptions);

    const resp = await invoice.createInvoice(datas);

    return {
      code: "success",
      message: "berhasil membuat invoice",
      data: resp,
    };
  } catch (error) {
    throw error;
  }
};

// exports.createDisbursement = async (datas) => {
//   try {
//     const { Disbursement } = xendit;
//     const disbursementSpecificOptions = {};
//     const disbursement = new Disbursement(disbursementSpecificOptions);

//     const resp = await disbursement.create(datas);

//     return {
//       code: "success",
//       message: "brhasil membuat disbursement",
//       data: resp,
//     };
//   } catch (error) {
//     throw error;
//   }
// };

module.exports = exports;
