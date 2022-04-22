"use strict";

exports.ok = (datas, res) => {
  res.status(200).send({ data: datas });
  res.end();
};

exports.err = (datas, res) => {
  let data = {
    message: "Internal Server Error",
    error: datas,
  };
  res.status(500).send(data);
  res.end();
};

exports.duplikat = (datas, res) => {
  res.status(409).send({ message: datas });
  res.end();
};

exports.errLogin = (datas, res) => {
  res.status(404).send({ message: datas });
  res.end();
};

exports.Login = (token, id, res) => {
  let data = {
    message: "Login Berhasil",
    token: token,
    userId: id,
  };
  res.status(200).send(data);
  res.end();
};

exports.notFound = (res, data) => {
  res.status(404).send({ message: "NOT FOUND", data: data });
  res.end();
};

exports.permissionDenied = (res, data) => {
  res.status(403).send({ message: data });
  res.send();
};

exports.overAmount = (res, data) => {
  res.status(405).send({ message: data });
  res.send();
};
