"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.EmailService = void 0;
var _dbConnection = require("../utils/dbConnection.js");
var _nodemailer = _interopRequireDefault(require("nodemailer"));
var _dotenv = _interopRequireDefault(require("dotenv"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
_dotenv["default"].config();
var EmailService = exports.EmailService = /*#__PURE__*/_createClass(function EmailService() {
  var _this = this;
  _classCallCheck(this, EmailService);
  // transporter = nodemailer.createTransport({
  //     service: 'gmail',
  //     auth: {
  //         user: process.env.EMAIL_USER,
  //         pass: process.env.EMAIL_PASS
  //     }
  // });
  _defineProperty(this, "sendResetPasswordEmail", function (email, token, req) {
    var url = "".concat(req.protocol, "://").concat(req.get('host'), "/reset-password?token=").concat(token);
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Reset Password',
      text: "You requested to reset your password. Click the link below to reset your password:\n\n".concat(url)
    };
    return _this.transporter.sendMail(mailOptions).then(function (info) {
      console.log("Email sent: ".concat(info.response));
    })["catch"](function (error) {
      console.error("Error sending email: ".concat(error));
    });
  });
  _defineProperty(this, "sendVerificationEmail", function (email, token, userId, phone, req) {
    var url = "".concat(req.protocol, "://").concat(req.get('host'), "/auth/verify-email?token=").concat(token);
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      text: "Thank you for registering and join our milk shop. Please verify your email by clicking the link below:\n\n".concat(url, "\n\nYour details:\nUserID: ").concat(userId, "\nPhone: ").concat(phone, "\nEmail: ").concat(email)
    };
    return _this.transporter.sendMail(mailOptions).then(function (info) {
      console.log("Verification email sent: ".concat(info.response));
    })["catch"](function (error) {
      console.error("Error sending verification email: ".concat(error));
    });
  });
  this.transporter = _nodemailer["default"].createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
});