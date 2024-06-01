"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.brandRoutes = void 0;
var _BrandController = require("../controllers/BrandController.js");
var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
var router = exports.brandRoutes = _express["default"].Router();
var brandController = new _BrandController.BrandController();
router.get('/', brandController.getAllBrands);