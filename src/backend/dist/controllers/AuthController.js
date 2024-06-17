"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
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
var _dbConnection = require("../utils/dbConnection.js");
var _emailService = require("../services/emailService.js");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _excluded = ["Password"];
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _objectWithoutProperties(e, t) { if (null == e) return {}; var o, r, i = _objectWithoutPropertiesLoose(e, t); if (Object.getOwnPropertySymbols) { var n = Object.getOwnPropertySymbols(e); for (r = 0; r < n.length; r++) o = n[r], t.indexOf(o) >= 0 || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]); } return i; }
function _objectWithoutPropertiesLoose(r, e) { if (null == r) return {}; var t = {}; for (var n in r) if ({}.hasOwnProperty.call(r, n)) { if (e.indexOf(n) >= 0) continue; t[n] = r[n]; } return t; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; } // Ensure correct import of the connection object
_dotenv["default"].config();
_passport["default"].use(new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(accessToken, refreshToken, profile, done) {
    var email, _yield$poolConnect$qu, _yield$poolConnect$qu2, results, _yield$poolConnect$qu3, _yield$poolConnect$qu4, maxUserIdResults, newUserId, newUser, token;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          email = profile.emails[0].value;
          _context.prev = 1;
          _context.next = 4;
          return _dbConnection.poolConnect.query('SELECT * FROM MEMBER WHERE Email = ?', [email]);
        case 4:
          _yield$poolConnect$qu = _context.sent;
          _yield$poolConnect$qu2 = _slicedToArray(_yield$poolConnect$qu, 1);
          results = _yield$poolConnect$qu2[0];
          if (!(results.length > 0)) {
            _context.next = 9;
            break;
          }
          return _context.abrupt("return", done(null, results[0]));
        case 9:
          _context.next = 11;
          return _dbConnection.poolConnect.query("SELECT MAX(CAST(SUBSTR(UserID, 3) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE 'UG%'");
        case 11:
          _yield$poolConnect$qu3 = _context.sent;
          _yield$poolConnect$qu4 = _slicedToArray(_yield$poolConnect$qu3, 1);
          maxUserIdResults = _yield$poolConnect$qu4[0];
          newUserId = "UG".concat((maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0'));
          newUser = {
            UserID: newUserId,
            Name: profile.displayName || '',
            Email: email,
            Phone: '',
            Address: '',
            RewardPoints: 0,
            Verified: 1
          };
          token = _jsonwebtoken["default"].sign({
            userId: newUserId
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          _context.next = 19;
          return _dbConnection.poolConnect.query('INSERT INTO TEMP_MEMBER (UserID, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?)', [newUserId, newUser.Name, newUser.Email, newUser.Phone, newUser.Address, token]);
        case 19:
          return _context.abrupt("return", done(null, newUser));
        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](1);
          return _context.abrupt("return", done(_context.t0));
        case 25:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 22]]);
  }));
  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));
_passport["default"].serializeUser(function (user, done) {
  done(null, user.UserID);
});
_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(id, done) {
    var _yield$poolConnect$qu5, _yield$poolConnect$qu6, results;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return _dbConnection.poolConnect.query('SELECT * FROM MEMBER WHERE UserID = ?', [id]);
        case 3:
          _yield$poolConnect$qu5 = _context2.sent;
          _yield$poolConnect$qu6 = _slicedToArray(_yield$poolConnect$qu5, 1);
          results = _yield$poolConnect$qu6[0];
          done(null, results[0]);
          _context2.next = 12;
          break;
        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2["catch"](0);
          done(_context2.t0);
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[0, 9]]);
  }));
  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}());
var registerUser = exports.registerUser = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(userData, req) {
    var Password, Name, Email, Phone, Address, _yield$poolConnect$qu7, _yield$poolConnect$qu8, results, existingUser, errorMessage, hashedPassword, _yield$poolConnect$qu9, _yield$poolConnect$qu10, maxUserIdResults, newUserId, token;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          Password = userData.Password, Name = userData.Name, Email = userData.Email, Phone = userData.Phone, Address = userData.Address;
          _context3.prev = 1;
          _context3.next = 4;
          return _dbConnection.poolConnect.query('SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?', [Email, Phone]);
        case 4:
          _yield$poolConnect$qu7 = _context3.sent;
          _yield$poolConnect$qu8 = _slicedToArray(_yield$poolConnect$qu7, 1);
          results = _yield$poolConnect$qu8[0];
          if (!(results.length > 0)) {
            _context3.next = 12;
            break;
          }
          existingUser = results[0];
          errorMessage = 'User already exists with ';
          if (existingUser.Email === Email) {
            errorMessage += 'this Email';
          } else if (existingUser.Phone === Phone) {
            errorMessage += 'this Phone number';
          }
          return _context3.abrupt("return", {
            message: errorMessage,
            status: 400
          });
        case 12:
          _context3.next = 14;
          return _bcryptjs["default"].hash(Password, 10);
        case 14:
          hashedPassword = _context3.sent;
          _context3.next = 17;
          return _dbConnection.poolConnect.query('SELECT MAX(CAST(SUBSTR(UserID, 2) AS UNSIGNED)) AS maxUserId FROM MEMBER WHERE UserID LIKE "U%"');
        case 17:
          _yield$poolConnect$qu9 = _context3.sent;
          _yield$poolConnect$qu10 = _slicedToArray(_yield$poolConnect$qu9, 1);
          maxUserIdResults = _yield$poolConnect$qu10[0];
          newUserId = "U".concat((maxUserIdResults[0].maxUserId ? maxUserIdResults[0].maxUserId + 1 : 1).toString().padStart(3, '0'));
          token = _jsonwebtoken["default"].sign({
            userId: newUserId
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          _context3.next = 24;
          return _dbConnection.poolConnect.query('INSERT INTO TEMP_MEMBER (UserID, Password, Name, Email, Phone, Address, Token) VALUES (?, ?, ?, ?, ?, ?, ?)', [newUserId, hashedPassword, Name, Email, Phone, Address, token]);
        case 24:
          _context3.next = 26;
          return (0, _emailService.sendVerificationEmail)(Email, token, newUserId, Phone, req);
        case 26:
          console.log('Verification email sent to:', Email);
          return _context3.abrupt("return", {
            message: 'User registered successfully. Verification email sent.'
          });
        case 30:
          _context3.prev = 30;
          _context3.t0 = _context3["catch"](1);
          throw _context3.t0;
        case 33:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[1, 30]]);
  }));
  return function registerUser(_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();
var loginUser = exports.loginUser = /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(userData) {
    var identifier, Password, _yield$poolConnect$qu11, _yield$poolConnect$qu12, results, user, isMatch, token, userPassword, userWithoutPassword;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          identifier = userData.identifier, Password = userData.Password;
          _context4.prev = 1;
          _context4.next = 4;
          return _dbConnection.poolConnect.query('SELECT * FROM MEMBER WHERE Email = ? OR Phone = ?', [identifier, identifier]);
        case 4:
          _yield$poolConnect$qu11 = _context4.sent;
          _yield$poolConnect$qu12 = _slicedToArray(_yield$poolConnect$qu11, 1);
          results = _yield$poolConnect$qu12[0];
          if (!(results.length === 0)) {
            _context4.next = 9;
            break;
          }
          return _context4.abrupt("return", {
            message: 'Invalid credentials',
            status: 401
          });
        case 9:
          user = results[0];
          _context4.next = 12;
          return _bcryptjs["default"].compare(Password, user.Password);
        case 12:
          isMatch = _context4.sent;
          if (isMatch) {
            _context4.next = 15;
            break;
          }
          return _context4.abrupt("return", {
            message: 'Invalid credentials',
            status: 401
          });
        case 15:
          token = _jsonwebtoken["default"].sign({
            userId: user.UserID
          }, process.env.JWT_SECRET, {
            expiresIn: '1h'
          });
          userPassword = user.Password, userWithoutPassword = _objectWithoutProperties(user, _excluded);
          return _context4.abrupt("return", {
            message: 'Login successful',
            token: token,
            user: userWithoutPassword
          });
        case 20:
          _context4.prev = 20;
          _context4.t0 = _context4["catch"](1);
          throw _context4.t0;
        case 23:
        case "end":
          return _context4.stop();
      }
    }, _callee4, null, [[1, 20]]);
  }));
  return function loginUser(_x9) {
    return _ref4.apply(this, arguments);
  };
}();
var verifyEmail = exports.verifyEmail = /*#__PURE__*/function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(token) {
    var decoded, userId, _yield$poolConnect$qu13, _yield$poolConnect$qu14, results, user;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          decoded = _jsonwebtoken["default"].verify(token, process.env.JWT_SECRET);
          userId = decoded.userId;
          _context5.next = 5;
          return _dbConnection.poolConnect.query('SELECT * FROM TEMP_MEMBER WHERE Token = ?', [token]);
        case 5:
          _yield$poolConnect$qu13 = _context5.sent;
          _yield$poolConnect$qu14 = _slicedToArray(_yield$poolConnect$qu13, 1);
          results = _yield$poolConnect$qu14[0];
          if (!(results.length === 0)) {
            _context5.next = 10;
            break;
          }
          return _context5.abrupt("return", {
            message: 'Invalid or expired token',
            status: 400
          });
        case 10:
          user = results[0];
          _context5.next = 13;
          return _dbConnection.poolConnect.query('INSERT INTO MEMBER (UserID, Password, Name, Email, Phone, Address, RewardPoints, Verified) VALUES (?, ?, ?, ?, ?, ?, 0, 1)', [user.UserID, user.Password, user.Name, user.Email, user.Phone, user.Address]);
        case 13:
          _context5.next = 15;
          return _dbConnection.poolConnect.query('DELETE FROM TEMP_MEMBER WHERE UserID = ?', [user.UserID]);
        case 15:
          return _context5.abrupt("return", {
            message: 'Email verified successfully'
          });
        case 18:
          _context5.prev = 18;
          _context5.t0 = _context5["catch"](0);
          throw _context5.t0;
        case 21:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[0, 18]]);
  }));
  return function verifyEmail(_x10) {
    return _ref5.apply(this, arguments);
  };
}();
var completeProfile = exports.completeProfile = /*#__PURE__*/function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee6(req) {
    var _req$body, userId, name, phone, address;
    return _regeneratorRuntime().wrap(function _callee6$(_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _req$body = req.body, userId = _req$body.userId, name = _req$body.name, phone = _req$body.phone, address = _req$body.address;
          _context6.prev = 1;
          _context6.next = 4;
          return _dbConnection.poolConnect.query('UPDATE MEMBER SET Name = ?, Phone = ?, Address = ? WHERE UserID = ?', [name, phone, address, userId]);
        case 4:
          return _context6.abrupt("return", {
            message: 'Profile completed successfully'
          });
        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](1);
          throw _context6.t0;
        case 10:
        case "end":
          return _context6.stop();
      }
    }, _callee6, null, [[1, 7]]);
  }));
  return function completeProfile(_x11) {
    return _ref6.apply(this, arguments);
  };
}();