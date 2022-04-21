const Joi = require("@hapi/joi");
const UUID = Joi.string().guid({ version: ["uuidv4", "uuidv5"] });

const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
});

const registrasiValidation = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(3).required(),
  roles: Joi.string().min(5).max(30).required(),
  gender: Joi.string().max(1).required(),
  phone_number: Joi.string().min(3).max(15).required(),
  bank_number: Joi.string(),
});

const usersUpdate = Joi.object({
  name: Joi.string().min(3).max(255).required(),
  email: Joi.string().email().lowercase().required(),
  roles: Joi.string().min(5).max(30).required(),
  gender: Joi.string().max(1).required(),
  phone_number: Joi.string().min(3).max(15).required(),
  bank_number: Joi.string(),
});

const changePass = Joi.object({
  oldPassword: Joi.string().min(3).required(),
  newPassword: Joi.string().min(3).required(),
  confirmPassword: Joi.string().min(3).required(),
});

const category = Joi.object({
  category_name: Joi.string().min(3).required(),
});

const getOne = Joi.object().keys({ id: UUID });
const del = Joi.object({ id: UUID });

module.exports = {
  login: loginValidation,
  register: registrasiValidation,
  getOne: getOne,
  del: del,
  usersUpdate: usersUpdate,
  changePass: changePass,
  category: category,
};
