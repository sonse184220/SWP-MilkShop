"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authRoutes = void 0;
var _AuthController = require("../controllers/AuthController.js");
var _express = _interopRequireDefault(require("express"));
var _validationMiddleware = require("../middlewares/validationMiddleware.js");
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var router = exports.authRoutes = _express["default"].Router();
var authController = new _AuthController.AuthController();
router.post('/register', _validationMiddleware.checkRegister, authController.registerUser);
router.post('/login', _validationMiddleware.checkLogin, authController.loginUser);
router.get('/verify-email', authController.verifyEmail);