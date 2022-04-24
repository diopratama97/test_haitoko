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
    return response.ok(result, res);
  } catch (error) {
    return response.err(error, res);
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
      return response.notFound(res);
    } else {
      return response.ok(getOneUser, res);
    }
  } catch (error) {
    return response.err(error, res);
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
      return response.notFound(res);
    } else {
      const usersData = {
        name: name,
        email: email,
        gender: gender,
        phone_number: phone_number,
      };
      await knex("user").update(usersData).where("id", id);
      return response.ok("UPDATE SUCCESS", res);
    }
  } catch (error) {
    return response.err(error, res);
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    const userLogin = req.cookies.userInfo;
    const { id } = await del.validateAsync(req.params);

    if (userLogin.role != "Administrator") {
      return response.permissionDenied(res, "Permission Denied");
    } else {
      if (id == userLogin.id) {
        return response.permissionDenied(
          res,
          "Cannot delete if you still login"
        );
      } else {
        const getUser = await knex("user")
          .select("*")
          .where("id", id)
          .whereNull("deleted_at")
          .first();
        if (!getUser) {
          return response.notFound(res);
        } else {
          await knex("user").update("deleted_at", new Date()).where("id", id);
          return response.ok("DELETE SUCCESS", res);
        }
      }
    }
  } catch (error) {
    return response.err(error, res);
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } =
      await changePass.validateAsync(req.body);
    const userId = req.cookies.userInfo;

    const getUser = await knex("user")
      .select("*")
      .where("id", userId.id)
      .whereNull("deleted_at")
      .first();

    if (!getUser) {
      return response.notFound(res, "User not found");
    } else {
      const checkPassword = newPassword == confirmPassword;
      const checkOldPassword = getUser.password == md5(oldPassword);

      if (checkOldPassword == false) {
        return response.err("Password lama salah!", res);
      }
      if (checkPassword == true) {
        await knex("user")
          .update("password", md5(newPassword))
          .where("id", getUser.id);
        return response.ok("BERHASIL UBAH PASSWORD", res);
      } else {
        return response.err("Password salah!", res);
      }
    }
  } catch (error) {
    return response.err(error.message, res);
  }
};
