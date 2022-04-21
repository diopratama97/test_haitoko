let response = require("../res");
let knex = require("../config/db/conn");
const {
  del,
  getOne,
  usersUpdate,
  changePass,
} = require("../helper/validations");
const md5 = require("md5");
require("dotenv").config();

exports.getAllUsers = async (req, res) => {
  try {
    const result = await knex("users").select("*").where("is_deleted", false);
    response.ok(result, res);
  } catch (error) {
    response.err(error, res);
  }
};

exports.getOneUsers = async (req, res) => {
  try {
    const { id } = await getOne.validateAsync(req.params);

    let getOneUser = await knex("users")
      .select("*")
      .where("id", id)
      .andWhere("is_deleted", false)
      .first();
    if (!getOneUser) {
      response.notFound(res);
    } else {
      response.ok(getOneUser, res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.updateUsers = async (req, res) => {
  try {
    const { id } = await getOne.validateAsync(req.params);
    const { name, email, roles, gender, phone_number, bank_number } =
      await usersUpdate.validateAsync(req.body);

    const getUser = await knex("users")
      .select("id")
      .where("id", id)
      .andWhere("is_deleted", false)
      .first();

    if (!getUser) {
      response.notFound(res);
    } else {
      const usersData = {
        name: name,
        email: email,
        roles: roles,
        gender: gender,
        phone_number: phone_number,
        bank_number: bank_number,
      };
      await knex("users").update(usersData).where("id", id);
      response.ok("UPDATE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const { id } = await del.validateAsync(req.params);

    const getUser = await knex("users")
      .select("id")
      .where("id", id)
      .andWhere("is_deleted", false)
      .first();
    if (!getUser) {
      response.notFound(res);
    } else {
      await knex("users").update("is_deleted", true).where("id", id);
      response.ok("DELETE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } =
      await changePass.validateAsync(req.body);
    const userId = req.cookies.userId;

    const getUser = await knex("users")
      .select("*")
      .where("id", userId)
      .andWhere("password", md5(oldPassword))
      .first();

    if (!getUser) {
      response.notFound(res);
    } else {
      const checkPassword = newPassword == confirmPassword;
      if (checkPassword == true) {
        await knex("users")
          .update("password", md5(newPassword))
          .where("id", getUser.id);
        response.ok("BERHASIL UBAH PASSWORD", res);
      } else {
        response.err("Password salah!", res);
      }
    }
  } catch (error) {
    response.err(error, res);
  }
};
