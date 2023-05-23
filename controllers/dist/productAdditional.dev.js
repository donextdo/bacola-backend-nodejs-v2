"use strict";

var Product = require("../models/product");

var _require = require("express"),
    request = _require.request;

var axios = require("axios");

var getproductByfilter = function getproductByfilter(req, res) {
  var baseUrl, categoryId, subCategories, brands, minPrice, maxPrice, subCatArr, brandArr, url, response, products;
  return regeneratorRuntime.async(function getproductByfilter$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          baseUrl = "http://localhost:4000/api";
          _context.prev = 1;
          categoryId = req.query.categoryId;
          subCategories = req.query.subCategories;
          brands = req.query.brands;
          minPrice = parseFloat(req.query.min_price);
          maxPrice = parseFloat(req.query.max_price);
          subCatArr = typeof subCategories === "string" ? subCategories.split(",") : [];
          brandArr = typeof brands === "string" ? brands.split(",") : [];
          url = subCatArr.length > 0 ? "".concat(baseUrl, "/products/").concat(subCatArr) : "".concat(baseUrl, "/products/").concat(categoryId);
          _context.next = 12;
          return regeneratorRuntime.awrap(axios.get(url));

        case 12:
          response = _context.sent;
          products = response.data;

          if (brandArr.length > 0) {
            products = products.filter(function (product) {
              return brandArr.includes(product.brand);
            });
          }

          if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            products = products.filter(function (product) {
              return product.price >= minPrice && product.price <= maxPrice;
            });
          }

          res.status(200).json(products);
          _context.next = 22;
          break;

        case 19:
          _context.prev = 19;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: "Server Error"
          });

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 19]]);
};

module.exports = {
  getproductByfilter: getproductByfilter
};
//# sourceMappingURL=productAdditional.dev.js.map
