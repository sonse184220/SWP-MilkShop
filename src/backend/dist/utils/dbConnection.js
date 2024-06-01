"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.poolConnect = exports.connection = void 0;
var _promise = _interopRequireDefault(require("mysql2/promise"));
var _mysql = _interopRequireDefault(require("mysql2"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
var port = process.env.PORT || 3000;

// Tạo kết nối đến database bằng pool
var poolConnect = exports.poolConnect = _promise["default"].createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
var connection = exports.connection = _mysql["default"].createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});