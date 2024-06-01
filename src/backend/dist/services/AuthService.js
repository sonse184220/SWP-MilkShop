"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthService = void 0;
var _dbConnection = require("../utils/dbConnection.js");
var _EmailService = require("./EmailService.js");
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _excluded = ["Password"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
_dotenv["default"].config();
var AuthService = exports.AuthService = /*#__PURE__*/_createClass(function AuthService() {
  var _this = this;
  _classCallCheck(this, AuthService);
  _defineProperty(this, "registerUser", function (userData, req, callback) {
    var UserID = userData.UserID,
      Password = userData.Password,
      Name = userData.Name,
      Email = userData.Email,
      Phone = userData.Phone,
      Address = userData.Address;
    var checkQuery = 'SELECT * FROM MEMBER WHERE UserID = ? OR Email = ? OR Phone = ?';
    _dbConnection.connection.query(checkQuery, [UserID, Email, Phone], function (err, results) {
      if (err) return callback(err);
      if (results.length > 0) {
        var existingUser = results[0];
        var errorMessage = 'User already exists with ';
        if (existingUser.UserID === UserID) {
          errorMessage += 'this UserID';
        } else if (existingUser.Email === Email) {
          errorMessage += 'this Email';
        } else if (existingUser.Phone === Phone) {
          errorMessage += 'this Phone number';
        }
        return callback(null, {
          message: errorMessage,
          status: 400
        });
      }
      _bcryptjs["default"].hash(Password, 10, function (err, hashedPassword) {
        if (err) return callback(err);
        var token = _jsonwebtoken["default"].sign({
          userId: UserID
        }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        var query = 'INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)';
        _dbConnection.connection.query(query, [UserID, hashedPassword, Name, Email, Phone, Address, token], function (err, result) {
          if (err) return callback(err);
          _this.emailService.sendVerificationEmail(Email, token, UserID, Phone, req).then(function () {
            console.log('Verification email sent to:', Email);
            callback(null, {
              message: 'User registered successfully. Verification email sent.'
            });
          })["catch"](function (error) {
            console.error('Error sending verification email:', error);
            callback(error);
          });
        });
      });
    });
  });
  _defineProperty(this, "loginUser", function (userData, callback) {
    var UserID = userData.UserID,
      Password = userData.Password;
    var query = 'SELECT * FROM MEMBER WHERE UserID = ?';
    _dbConnection.connection.query(query, [UserID], function (err, results) {
      if (err) return callback(err);
      if (results.length === 0) {
        return callback(null, {
          message: 'Invalid UserID',
          status: 401
        });
      }
      var user = results[0];
      _bcryptjs["default"].compare(Password, user.Password, function (err, isMatch) {
        if (err) return callback(err);
        if (!isMatch) {
          return callback(null, {
            message: 'Invalid Password',
            status: 401
          });
        }
        var token = _jsonwebtoken["default"].sign({
          userId: user.UserID
        }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        var Password = user.Password,
          userWithoutPassword = _objectWithoutProperties(user, _excluded);
        callback(null, {
          message: 'Login successful',
          token: token,
          user: userWithoutPassword
        });
      });
    });
  });
  _defineProperty(this, "verifyEmail", function (token, callback) {
    try {
      var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
      var userId = decoded.userId;
      var selectQuery = 'SELECT * FROM TEMP_MEMBER WHERE Token = ?';
      _dbConnection.connection.query(selectQuery, [token], function (err, results) {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, {
          message: 'Invalid or expired token',
          status: 400
        });
        var user = results[0];
        var insertQuery = 'INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)';
        var deleteQuery = 'DELETE FROM TEMP_MEMBER WHERE UserID = ?';
        _dbConnection.connection.query(insertQuery, [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address], function (err, result) {
          if (err) return callback(err);
          _dbConnection.connection.query(deleteQuery, [user.UserID], function (err, result) {
            if (err) return callback(err);
            callback(null, {
              message: 'Email verified successfully'
            });
          });
        });
      });
    } catch (err) {
      callback(err);
    }
  });
  this.emailService = new _EmailService.EmailService();
});