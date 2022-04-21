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
    const result = await knex("user").select("*").whereNull("deleted_at");
    response.ok(result, res);
  } catch (error) {
    response.err(error, res);
  }
};

exports.getOneUsers = async (req, res) => {
  try {
    const { id } = await getOne.validateAsync(req.params);

    const getOneUser = await knex("user")
      .select("*")
      .where("id", id)
      .whereNull("deleted_at")
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
    const { name, email, gender, phone_number } =
      await usersUpdate.validateAsync(req.body);

    const getUser = await knex("user")
      .select("*")
      .where("id", id)
      .whereNull("deleted_at")
      .first();

    if (!getUser) {
      response.notFound(res);
    } else {
      const usersData = {
        name: name,
        email: email,
        gender: gender,
        phone_number: phone_number,
      };
      await knex("user").update(usersData).where("id", id);
      response.ok("UPDATE SUCCESS", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const userLogin = req.cookies.userInfo;
    const { id } = await del.validateAsync(req.params);

    if (userLogin.role != "Administrator") {
      response.permissionDenied(res, "Permission Denied");
    } else {
      if (id == userLogin.id) {
        response.permissionDenied(res, "Cannot delete if you still login");
      } else {
        const getUser = await knex("user")
          .select("*")
          .where("id", id)
          .whereNull("deleted_at")
          .first();
        if (!getUser) {
          response.notFound(res);
        } else {
          await knex("user").update("deleted_at", new Date()).where("id", id);
          response.ok("DELETE SUCCESS", res);
        }
      }
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

    const getUser = await knex("user")
      .select("*")
      .where("id", userId)
      .whereNull("deleted_at")
      .andWhere("password", md5(oldPassword))
      .first();

    if (!getUser) {
      response.notFound(res);
    } else {
      const checkPassword = newPassword == confirmPassword;
      if (checkPassword == true) {
        await knex("user")
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
