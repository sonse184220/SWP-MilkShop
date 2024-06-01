"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkResetPasswordRequest = exports.checkResetPassword = exports.checkRegister = exports.checkLogin = void 0;
var _expressValidator = require("express-validator");
var checkRegister = exports.checkRegister = [(0, _expressValidator.body)('UserID').trim().exists().withMessage('UserID is required').notEmpty().withMessage('UserID cannot be empty'), (0, _expressValidator.body)('Password').trim().exists().withMessage('Password is required').isLength({
  min: 6
}).withMessage('Password must be at least 6 characters long'), (0, _expressValidator.body)('Name').trim().exists().withMessage('Name is required').notEmpty().withMessage('Name cannot be empty'), (0, _expressValidator.body)('Email').trim().exists().withMessage('Email is required').isEmail().withMessage('Email is invalid'), (0, _expressValidator.body)('Phone').trim().exists().withMessage('Phone is required').notEmpty().withMessage('Phone cannot be empty'), (0, _expressValidator.body)('Address').trim().exists().withMessage('Address is required').notEmpty().withMessage('Address cannot be empty'), function (req, res, next) {
  var result = (0, _expressValidator.validationResult)(req);
  if (!result.isEmpty()) {
    return res.status(400).send({
      error: result.array()
    });
  }
  Object.assign(req.body, (0, _expressValidator.matchedData)(req));
  next();
}];
var checkLogin = exports.checkLogin = [(0, _expressValidator.body)('UserID').trim().exists().withMessage('UserID is required').notEmpty().withMessage('UserID cannot be empty'), (0, _expressValidator.body)('Password').trim().exists().withMessage('Password is required').notEmpty().withMessage('Password cannot be empty'), function (req, res, next) {
  var result = (0, _expressValidator.validationResult)(req);
  if (!result.isEmpty()) {
    return res.status(400).send({
      error: result.array()
    });
  }
  Object.assign(req.body, (0, _expressValidator.matchedData)(req));
  next();
}];
var checkResetPasswordRequest = exports.checkResetPasswordRequest = [(0, _expressValidator.body)('email').trim().exists().withMessage('Email is required').isEmail().withMessage('Email is invalid'), function (req, res, next) {
  var result = (0, _expressValidator.validationResult)(req);
  if (!result.isEmpty()) {
    return res.status(400).send({
      error: result.array()
    });
  }
  Object.assign(req.body, (0, _expressValidator.matchedData)(req));
  next();
}];
var checkResetPassword = exports.checkResetPassword = [(0, _expressValidator.body)('token').trim().exists().withMessage('Token is required').notEmpty().withMessage('Token cannot be empty'), (0, _expressValidator.body)('newPassword').trim().exists().withMessage('New password is required').isLength({
  min: 6
}).withMessage('New password must be at least 6 characters long'), function (req, res, next) {
  var result = (0, _expressValidator.validationResult)(req);
  if (!result.isEmpty()) {
    return res.status(400).send({
      error: result.array()
    });
  }
  Object.assign(req.body, (0, _expressValidator.matchedData)(req));
  next();
}];