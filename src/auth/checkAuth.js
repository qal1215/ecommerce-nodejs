"use strict";

const { HEADER_NAME } = require("../constant/header/headerName");
const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER_NAME.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error key",
      });
    }

    const objKey = await findById(key);

    if (!objKey) {
      return res.status(403).json({
        message: "Forbidden Error obj key",
      });
    }

    req.objKey = objKey;

    return next();
  } catch (err) {
    return res.status(403).json({
      message: "Forbidden Error check auth",
      errorMessage: err.message,
    });
  }
};

const permissions = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permissions Denied",
      });
    }
    const hasPermission = req.objKey.permissions.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({
        message: "Permission Denied",
      });
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permissions,
};
