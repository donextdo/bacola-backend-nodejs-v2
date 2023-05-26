const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const unless = require("express-unless");
const auth = require("./middlewares/jwt");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const port = process.env.PORT || 4000;
const URL = process.env.MONGO_URI;

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// function authenticateUnlessRegisterOrLogin(req, res, next) {
//   if (req.path === "/api/users/register" && req.method === "POST") {
//     return next();
//   }

//   if (req.path === "/api/users/login" && req.method === "POST") {
//     return next();
//   }

//   return auth.authenticateToken(req, res, next);
// }

// app.use(authenticateUnlessRegisterOrLogin);

// app.listen(port, () => {
//   console.log(`Server Is Running on Port: ${port}`);
// });

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

let userAuth = require("./routes/user");
app.use("/api/users", userAuth);

let product = require("./routes/product");
app.use("/api/products", product);

let productDetails = require("./routes/productAdditional");
app.use("/api/productDetails", productDetails);

let order = require("./routes/order");
app.use("/api/orders", order);

let review = require("./routes/review");
app.use("/api/reviews", review);

let favourite = require("./routes/favourite");
app.use("/api/favourites", favourite);

let category = require("./routes/category ");
app.use("/api/categories", category);

let coupon = require("./routes/coupon");
app.use("/api/coupons", coupon);

let location = require("./routes/location");
const Product = require("./models/product");
app.use("/api/locations", location);

const server = http.createServer(app);
const io = socketIo(server);

async function searchProducts(query) {
  try {
    const response = await axios.get(
      "http://localhost:4000/api/products/getAll"
    );
    const products = response.data;
    //console.log("response , ", response);
    if (!products) {
      console.error("Products not found in API response.");
      return [];
    }
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    console.log(filteredProducts);
    return filteredProducts;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
}
io.on("connection", (socket) => {
  console.log("A client connected.");

  // Socket.io event listener for search requests
  socket.on("search", async (query) => {
    console.log(`Received search query: ${query}`);

    const results = await searchProducts(query);

    // Send the search results back to the client
    socket.emit("searchResults", results);
  });

  // Socket.io event listener for client disconnections
  socket.on("disconnect", () => {
    console.log("A client disconnected.");
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
