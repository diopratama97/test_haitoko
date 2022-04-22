const Joi = require("@hapi/joi");
const UUID = Joi.string().guid({ version: ["uuidv4", "uuidv5"] });

exports.loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});

exports.registrasiValidation = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
  gender: Joi.string().max(1).required(),
  phone_number: Joi.string().min(5).max(15).required(),
  role: Joi.string().valid("Administrator", "Buyer").required(),
});

exports.usersUpdate = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
  gender: Joi.string().max(1).required(),
  phone_number: Joi.string().min(5).max(15).required(),
});

exports.changePass = Joi.object({
  oldPassword: Joi.string().min(3).required(),
  newPassword: Joi.string().min(3).required(),
  confirmPassword: Joi.string().min(3).required(),
});

exports.category = Joi.object({
  category_name: Joi.string().min(3).required(),
});

exports.product = Joi.object({
  product_name: Joi.string().required(),
  category_id: UUID,
  stock: Joi.number().required(),
  price: Joi.number().required(),
  discount: Joi.number(),
});

exports.getOne = Joi.object().keys({ id: UUID });
exports.del = Joi.object({ id: UUID });

module.exports = exports;
