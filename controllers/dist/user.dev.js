"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bcrypt = require("bcryptjs");

var _require = require("express"),
    request = _require.request;

var User = require("../models/user");

var auth = require("../middlewares/jwt"); //register new user


var register = function register(req, res) {
  var userName, email, pwd, isFavourite, salt, password, user, userExists, response;
  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          userName = req.body.userName;
          email = req.body.email;
          pwd = req.body.password;
          isFavourite = req.body.isFavourite;
          salt = bcrypt.genSaltSync(10);
          password = bcrypt.hashSync(pwd, salt);
          user = new User({
            userName: userName,
            email: email,
            password: password,
            isFavourite: isFavourite
          });
          _context.prev = 7;
          _context.next = 10;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 10:
          userExists = _context.sent;

          if (!userExists) {
            _context.next = 15;
            break;
          }

          res.status(400).send({
            message: "User Already Exists"
          });
          _context.next = 23;
          break;

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(user.save());

        case 17:
          response = _context.sent;

          if (!response) {
            _context.next = 22;
            break;
          }

          return _context.abrupt("return", res.status(201).send({
            message: "New User registered"
          }));

        case 22:
          return _context.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 23:
          _context.next = 29;
          break;

        case 25:
          _context.prev = 25;
          _context.t0 = _context["catch"](7);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(400).send({
            message: "Error while registering a user"
          }));

        case 29:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[7, 25]]);
}; //login user


var login = function login(req, res) {
  var email, password, user, token;
  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          email = req.body.email;
          password = req.body.password;
          _context2.prev = 2;
          _context2.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context2.sent;

          if (!user) {
            _context2.next = 15;
            break;
          }

          if (!(user && bcrypt.compareSync(password, user.password))) {
            _context2.next = 12;
            break;
          }

          token = auth.generateAccessToken(email);
          return _context2.abrupt("return", res.status(200).send(_objectSpread({}, user.toJSON(), {
            token: token
          })));

        case 12:
          return _context2.abrupt("return", res.status(400).send({
            message: "Such user does not exist check your credentials "
          }));

        case 13:
          _context2.next = 16;
          break;

        case 15:
          return _context2.abrupt("return", res.status(404).send({
            message: "Such user does not exist"
          }));

        case 16:
          _context2.next = 21;
          break;

        case 18:
          _context2.prev = 18;
          _context2.t0 = _context2["catch"](2);
          return _context2.abrupt("return", res.status(400).send({
            message: "Such user does not exist check your credentials"
          }));

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[2, 18]]);
};

var getAllUsers = function getAllUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getAllUsers$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.find());

        case 3:
          users = _context3.sent;

          if (!users) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.json(users));

        case 8:
          return _context3.abrupt("return", res.status(404).send({
            message: "Error on retrieving users"
          }));

        case 9:
          _context3.next = 14;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);
          return _context3.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var getOneUser = function getOneUser(req, res) {
  var email, user;
  return regeneratorRuntime.async(function getOneUser$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          email = req.params.email;
          _context4.prev = 1;
          _context4.next = 4;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 4:
          user = _context4.sent;

          if (!user) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.json(user));

        case 9:
          return _context4.abrupt("return", res.status(404).send({
            message: "No such user found"
          }));

        case 10:
          _context4.next = 15;
          break;

        case 12:
          _context4.prev = 12;
          _context4.t0 = _context4["catch"](1);
          return _context4.abrupt("return", res.status(500).send({
            message: "Internal Server Error"
          }));

        case 15:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

var updateUserPassword = function updateUserPassword(req, res) {
  var email, password, user, salt, updatePassword, newUser, response;
  return regeneratorRuntime.async(function updateUserPassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          email = req.params.email;
          password = req.params.pwd;
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 5:
          user = _context5.sent;

          if (!user) {
            _context5.next = 26;
            break;
          }

          salt = bcrypt.genSaltSync(10);
          updatePassword = bcrypt.hashSync(password, salt);
          newUser = {
            userName: user.userName,
            email: user.email,
            password: updatePassword,
            isFavourite: user.isFavourite
          };
          _context5.prev = 10;
          _context5.next = 13;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: email
          }, newUser));

        case 13:
          response = _context5.sent;

          if (!response) {
            _context5.next = 18;
            break;
          }

          return _context5.abrupt("return", res.status(200).send({
            message: "Successfully updated Password"
          }));

        case 18:
          return _context5.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 19:
          _context5.next = 24;
          break;

        case 21:
          _context5.prev = 21;
          _context5.t0 = _context5["catch"](10);
          return _context5.abrupt("return", res.status(400).send({
            message: "Unable to update recheck your email"
          }));

        case 24:
          _context5.next = 27;
          break;

        case 26:
          return _context5.abrupt("return", res.status(404).send({
            message: "No such user with entered email"
          }));

        case 27:
          _context5.next = 32;
          break;

        case 29:
          _context5.prev = 29;
          _context5.t1 = _context5["catch"](2);
          return _context5.abrupt("return", res.status(404).send({
            message: "No such user with entered email"
          }));

        case 32:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 29], [10, 21]]);
};

var updateUser = function updateUser(req, res) {
  var email, user, password, updateUser, response;
  return regeneratorRuntime.async(function updateUser$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          email = req.params.email;
          _context6.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context6.sent;
          password = user.password;
          updateUser = {
            userName: req.body.userName,
            email: req.body.email,
            password: password,
            isFavourite: req.body.isFavourite
          };
          _context6.prev = 6;
          _context6.next = 9;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: email
          }, updateUser));

        case 9:
          response = _context6.sent;

          if (!response) {
            _context6.next = 14;
            break;
          }

          return _context6.abrupt("return", res.status(200).send({
            message: "Successfully updated User Details"
          }));

        case 14:
          return _context6.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 15:
          _context6.next = 20;
          break;

        case 17:
          _context6.prev = 17;
          _context6.t0 = _context6["catch"](6);
          return _context6.abrupt("return", res.status(400).send({
            message: "Unable to update recheck your email"
          }));

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[6, 17]]);
};

var updateBillingAddress = function updateBillingAddress(req, res) {
  var email, user, password, updateBillingAddress, response;
  return regeneratorRuntime.async(function updateBillingAddress$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          email = req.params.email;
          _context7.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: email
          }));

        case 3:
          user = _context7.sent;
          password = user.password;
          updateBillingAddress = {
            userName: req.body.userName,
            email: req.body.email,
            password: password,
            isFavourite: req.body.isFavourite,
            billingAddress: req.body.billingAddress
          };
          _context7.prev = 6;
          _context7.next = 9;
          return regeneratorRuntime.awrap(User.findOneAndUpdate({
            email: email
          }, updateBillingAddress));

        case 9:
          response = _context7.sent;

          if (!response) {
            _context7.next = 14;
            break;
          }

          return _context7.abrupt("return", res.status(200).send({
            message: "Successfully updated User Details"
          }));

        case 14:
          return _context7.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 15:
          _context7.next = 20;
          break;

        case 17:
          _context7.prev = 17;
          _context7.t0 = _context7["catch"](6);
          return _context7.abrupt("return", res.status(400).send({
            message: "Unable to update recheck your email"
          }));

        case 20:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[6, 17]]);
};

module.exports = {
  register: register,
  login: login,
  getAllUsers: getAllUsers,
  getOneUser: getOneUser,
  updateUserPassword: updateUserPassword,
  updateUser: updateUser,
  updateBillingAddress: updateBillingAddress
};
//# sourceMappingURL=user.dev.js.map
