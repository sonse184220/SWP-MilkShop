"use strict";

var _express = _interopRequireDefault(require("express"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
var _authRoutes = require("./routes/authRoutes.js");
var _brandRoutes = require("./routes/brandRoutes.js");
var _dotenv = _interopRequireDefault(require("dotenv"));
var _productRoutes = require("./routes/productRoutes.js");
var _blogRoutes = require("./routes/blogRoutes.js");
var _cors = _interopRequireDefault(require("cors"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
_dotenv["default"].config();
// Import CORS middleware

var PORT = process.env.PORT || 3000; // cổng kết nối localhost:xxxx

var app = (0, _express["default"])(); // khởi chạy express
app.use(_express["default"].json()); // dùng json
app.use(_bodyParser["default"].json());

// Enable CORS for specific origin
app.use((0, _cors["default"])({
  origin: 'http://localhost:3000'
}));

// API liên quan đến product
app.use(_productRoutes.productRoutes);

// API liên quan đến blogs
app.use(_blogRoutes.blogRoutes);
app.use('/auth', _authRoutes.authRoutes);
app.use('/product', _productRoutes.productRoutes);
app.use('/brand', _brandRoutes.brandRoutes);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// bắt error bị lọt qua các check
app.use(function (err, req, res, next) {
  console.error(err);
  var statusCode = err.statusCode || 500;
  var message = err.message || "Internal Server Error";
  res.status(statusCode).send({
    status: "error",
    statusCode: statusCode,
    message: message
  });
});

// khởi chạy server 
app.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});

// Enable CORS for specific origin
app.use((0, _cors["default"])({
  origin: 'http://localhost:3000'
}));