"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyEmail = exports.registerUser = exports.loginUser = exports.completeProfile = void 0;
var authController = _interopRequireWildcard(require("../controllers/AuthController.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != _typeof(e) && "function" != typeof e) return { "default": e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n["default"] = e, t && t.set(e, n), n; }
var registerUser = exports.registerUser = function registerUser(req, res) {
  authController.registerUser(req.body, req, function (err, result) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.status(result.status || 201).json(result);
  });
};
var loginUser = exports.loginUser = function loginUser(req, res) {
  authController.loginUser(req.body, function (err, result) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.status(result.status || 200).json(result);
  });
};
var verifyEmail = exports.verifyEmail = function verifyEmail(req, res) {
  authController.verifyEmail(req.query.token, function (err, result) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.status(result.status || 200).json(result);
  });
};
var completeProfile = exports.completeProfile = function completeProfile(req, res) {
  authController.completeProfile(req, function (err, result) {
    if (err) return res.status(500).json({
      error: err.message
    });
    res.status(200).json(result);
  });
};