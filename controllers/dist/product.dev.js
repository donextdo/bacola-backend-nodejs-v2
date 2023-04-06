"use strict";

var Product = require("../models/product");

var _require = require("express"),
    request = _require.request; //insert product


var addProduct = function addProduct(req, res) {
  var title, brand, description, image, category, quantity, price, isAvailable, skuNumber, type, mfgDate, expDate, discount, review, createdAt, updatedAt, deletedAt, product, response;
  return regeneratorRuntime.async(function addProduct$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          title = req.body.title;
          brand = req.body.brand;
          description = req.body.description;
          image = req.body.image;
          category = req.body.category;
          quantity = req.body.quantity;
          price = req.body.price;
          isAvailable = req.body.isAvailable;
          skuNumber = req.body.price;
          type = req.body.type;
          mfgDate = req.body.mfgDate;
          expDate = req.body.expDate;
          discount = req.body.discount;
          review = req.body.review;
          createdAt = new Date();
          updatedAt = null;
          deletedAt = null; //const isFavourite = req.body.isFavourite;

          product = new Product({
            title: title,
            brand: brand,
            description: description,
            image: image,
            category: category,
            quantity: quantity,
            price: price,
            isAvailable: isAvailable,
            skuNumber: skuNumber,
            type: type,
            mfgDate: mfgDate,
            expDate: expDate,
            discount: discount,
            review: review,
            createdAt: createdAt,
            updatedAt: updatedAt,
            deletedAt: deletedAt // isFavourite,

          });
          _context.prev = 18;
          _context.next = 21;
          return regeneratorRuntime.awrap(product.save());

        case 21:
          response = _context.sent;

          if (!response) {
            _context.next = 26;
            break;
          }

          return _context.abrupt("return", res.status(201).send({
            message: "New Product Insered"
          }));

        case 26:
          return _context.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 27:
          _context.next = 33;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](18);
          console.log(_context.t0);
          return _context.abrupt("return", res.status(400).send({
            message: "Error while saving products"
          }));

        case 33:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[18, 29]]);
}; //get All Product


var getAllProduct = function getAllProduct(req, res) {
  var products;
  return regeneratorRuntime.async(function getAllProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(Product.find());

        case 3:
          products = _context2.sent;

          if (!products) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.json(products));

        case 8:
          return _context2.abrupt("return", res.status(404).send({
            message: "Error occured when retrieving products"
          }));

        case 9:
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          return _context2.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
}; //get product by id


var getProductById = function getProductById(req, res) {
  var productId, response;
  return regeneratorRuntime.async(function getProductById$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          productId = req.params.id; //console.log("data", productId);

          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Product.findById(productId));

        case 4:
          response = _context3.sent;

          if (!response) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.json(response));

        case 9:
          return _context3.abrupt("return", res.status(404).send({
            message: "No such product found"
          }));

        case 10:
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](1);
          return _context3.abrupt("return", res.status(404).send({
            message: "No such product found"
          }));

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 12]]);
}; //update product by id


var updateProduct = function updateProduct(req, res) {
  var Id, productUpdate, response;
  return regeneratorRuntime.async(function updateProduct$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          Id = req.params.id;
          productUpdate = {
            Id: Id,
            title: req.body.title,
            brand: req.body.brand,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category,
            quantity: req.body.quantity,
            price: req.body.price,
            isAvailable: req.body.isAvailable,
            skuNumber: req.body.price,
            type: req.body.type,
            mfgDate: req.body.mfgDate,
            expDate: req.body.expDate,
            discount: req.body.discount,
            review: req.body.review,
            updatedAt: new Date()
          };
          _context4.prev = 2;
          _context4.next = 5;
          return regeneratorRuntime.awrap(Product.findOneAndUpdate({
            _id: Id
          }, productUpdate));

        case 5:
          response = _context4.sent;

          if (!response) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", res.status(200).send({
            message: "Successfully updated Product "
          }));

        case 10:
          return _context4.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 11:
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](2);
          return _context4.abrupt("return", res.status(400).send({
            message: "Unable to update"
          }));

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

var deleteUpdate = function deleteUpdate(req, res) {
  var Id, updateDeleteDate, response;
  return regeneratorRuntime.async(function deleteUpdate$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          Id = req.params.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Product.findById(Id));

        case 3:
          updateDeleteDate = _context5.sent;
          updateDeleteDate.deletedAt = new Date(); // return await response.save();

          _context5.prev = 5;
          _context5.next = 8;
          return regeneratorRuntime.awrap(updateDeleteDate.save());

        case 8:
          response = _context5.sent;

          if (!response) {
            _context5.next = 13;
            break;
          }

          return _context5.abrupt("return", res.status(201).send({
            message: "delete date is updated"
          }));

        case 13:
          return _context5.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 14:
          _context5.next = 20;
          break;

        case 16:
          _context5.prev = 16;
          _context5.t0 = _context5["catch"](5);
          console.log(_context5.t0);
          return _context5.abrupt("return", res.status(400).send({
            message: "Error while saving products"
          }));

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[5, 16]]);
}; //delete product by id


var deleteProduct = function deleteProduct(req, res) {
  var Id, response;
  return regeneratorRuntime.async(function deleteProduct$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          Id = req.params.id;
          _context6.prev = 1;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Product.findByIdAndDelete({
            _id: Id
          }));

        case 4:
          response = _context6.sent;

          if (!response) {
            _context6.next = 9;
            break;
          }

          return _context6.abrupt("return", res.status(204).send({
            message: "Successfully deleted a Request"
          }));

        case 9:
          return _context6.abrupt("return", res.status(500).send({
            message: "Internal server error"
          }));

        case 10:
          _context6.next = 16;
          break;

        case 12:
          _context6.prev = 12;
          _context6.t0 = _context6["catch"](1);
          console.log(_context6.t0.message);
          return _context6.abrupt("return", res.status(400).send({
            message: "Could not delete the request"
          }));

        case 16:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[1, 12]]);
};

module.exports = {
  addProduct: addProduct,
  getAllProduct: getAllProduct,
  getProductById: getProductById,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  deleteUpdate: deleteUpdate
};
//# sourceMappingURL=product.dev.js.map
