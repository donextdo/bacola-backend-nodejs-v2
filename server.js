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
const expressWinston = require("express-winston");
const { transports, format } = require("winston");
require("winston-mongodb");
const logger = require("./logger");
const port = process.env.PORT || 3000;
const URL = process.env.MONGO_URI;

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
  })
);
const myFormat = format.printf(({ level, meta, timestamp }) => {
  return `${timestamp} ${level}: ${meta.message}`;
});
app.use(
  expressWinston.errorLogger({
    transports: [
      new transports.File({
        filename: "logsInternalErrors.log",
      }),
    ],
    format: format.combine(format.json(), format.timestamp(), myFormat),
  })
);

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

let categoryName = require("./routes/category ");
app.use("/api/categories/get", categoryName);

let coupon = require("./routes/coupon");
app.use("/api/coupons", coupon);

let subscribe = require("./routes/subscribe");
app.use("/api/subscribe", subscribe);

let location = require("./routes/location");
const Product = require("./models/product");
app.use("/api/locations", location);

const server = http.createServer(app);
const io = socketIo(server);

async function searchProducts(query) {
  try {
    const response = await axios.get(
      "http://localhost:3000/api/products/getAll/"
    );
    const products = response.data;
    if (!products) {
      return [];
    }
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(query.toLowerCase())
    );
    return filteredProducts;
  } catch (error) {
    return [];
  }
}
io.on("connection", (socket) => {
  console.log("A client connected.");

  // Socket.io event listener for search requests
  socket.on("search", async (query) => {
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
