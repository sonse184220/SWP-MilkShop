"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loginUser = exports.completeProfile = void 0;
Object.defineProperty(exports, "passport", {
  enumerable: true,
  get: function get() {
    return _passport["default"];
  }
});
exports.verifyEmail = exports.registerUser = void 0;
var _bcryptjs = _interopRequireDefault(require("bcryptjs"));
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
var _passport = _interopRequireDefault(require("passport"));
var _passportGoogleOauth = require("passport-google-oauth20");
var _dbConnection = _interopRequireDefault(require("../utils/dbConnection.js"));
var _emailService = require("../services/emailService.js");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _excluded = ["Password"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
_dotenv["default"].config();
_passport["default"].use(new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, function (accessToken, refreshToken, profile, done) {
  var email = profile.emails[0].value;
  var checkQuery = 'SELECT * FROM MEMBER WHERE Email = ?';
  _dbConnection["default"].query(checkQuery, [email], function (err, results) {
    if (err) return done(err);
    if (results.length > 0) {
      return done(null, results[0]);
    }
    var getMaxUserIdQuery = "SELECT MAX(CAST(SUBSTR(UserID, 3) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE 'UG%'";
    _dbConnection["default"].query(getMaxUserIdQuery, function (err, results) {
      if (err) return done(err);
      var newUserId = "UG".concat((results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0'));
      var newUser = {
        UserID: newUserId,
        Name: profile.displayName || '',
        Email: email,
        Phone: '',
        Address: '',
        RewardPoints: 0,
        Verified: 1
      };
      var query = 'INSERT INTO TEMP_MEMBER (UserID, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)';
      var token = _jsonwebtoken["default"].sign({
        userId: newUserId
      }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      _dbConnection["default"].query(query, [newUserId, newUser.Name, newUser.Email, newUser.Phone, newUser.Address, token], function (err, result) {
        if (err) return done(err);
        return done(null, newUser);
      });
    });
  });
}));
_passport["default"].serializeUser(function (user, done) {
  done(null, user.UserID);
});
_passport["default"].deserializeUser(function (id, done) {
  var query = 'SELECT * FROM MEMBER WHERE UserID = ?';
  _dbConnection["default"].query(query, [id], function (err, results) {
    if (err) return done(err);
    done(null, results[0]);
  });
});
var registerUser = exports.registerUser = function registerUser(userData, req, callback) {
  var Password = userData.Password,
    Name = userData.Name,
    Email = userData.Email,
    Phone = userData.Phone,
    Address = userData.Address;
  var checkQuery = 'SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?';
  _dbConnection["default"].query(checkQuery, [Email, Phone], function (err, results) {
    if (err) return callback(err);
    if (results.length > 0) {
      var existingUser = results[0];
      var errorMessage = 'User already exists with ';
      if (existingUser.Email === Email) {
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
      var getMaxUserIdQuery = 'SELECT MAX(CAST(SUBSTR(UserID, 2) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE "U%"';
      _dbConnection["default"].query(getMaxUserIdQuery, function (err, results) {
        if (err) return callback(err);
        var newUserId = "U".concat((results[0].maxUserId ? results[0].maxUserId + 1 : 1).toString().padStart(3, '0'));
        var token = _jsonwebtoken["default"].sign({
          userId: newUserId
        }, process.env.JWT_SECRET, {
          expiresIn: '1h'
        });
        var query = 'INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)';
        _dbConnection["default"].query(query, [newUserId, hashedPassword, Name, Email, Phone, Address, token], function (err, result) {
          if (err) return callback(err);
          (0, _emailService.sendVerificationEmail)(Email, token, newUserId, Phone, req).then(function () {
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
};
var loginUser = exports.loginUser = function loginUser(userData, callback) {
  var identifier = userData.identifier,
    Password = userData.Password;
  var query = 'SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?';
  _dbConnection["default"].query(query, [identifier, identifier], function (err, results) {
    if (err) return callback(err);
    if (results.length === 0) {
      return callback(null, {
        message: 'Invalid credentials',
        status: 401
      });
    }
    var user = results[0];
    _bcryptjs["default"].compare(Password, user.Password, function (err, isMatch) {
      if (err) return callback(err);
      if (!isMatch) {
        return callback(null, {
          message: 'Invalid credentials',
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
};
var verifyEmail = exports.verifyEmail = function verifyEmail(token, callback) {
  try {
    var decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
    var userId = decoded.userId;
    var selectQuery = 'SELECT * FROM TEMP_MEMBER WHERE Token = ?';
    _dbConnection["default"].query(selectQuery, [token], function (err, results) {
      if (err) return callback(err);
      if (results.length === 0) return callback(null, {
        message: 'Invalid or expired token',
        status: 400
      });
      var user = results[0];
      var insertQuery = 'INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)';
      var deleteQuery = 'DELETE FROM TEMP_MEMBER WHERE UserID = ?';
      _dbConnection["default"].query(insertQuery, [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address], function (err, result) {
        if (err) return callback(err);
        _dbConnection["default"].query(deleteQuery, [user.UserID], function (err, result) {
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
};
var completeProfile = exports.completeProfile = function completeProfile(req, callback) {
  var _req$body = req.body,
    userId = _req$body.userId,
    name = _req$body.name,
    phone = _req$body.phone,
    address = _req$body.address;
  var query = 'UPDATE MEMBER SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?';
  _dbConnection["default"].query(query, [name, phone, address, userId], function (err, result) {
    if (err) return callback(err);
    callback(null, {
      message: 'Profile completed successfully'
    });
  });
};