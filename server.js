const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const app = express();
const unless = require("express-unless");
const auth = require("./middlewares/jwt");

const port = process.env.PORT || 4000;
const URL = process.env.MONGO_URI;

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function authenticateUnlessRegisterOrLogin(req, res, next) {
  if (req.path === "/api/users/register" && req.method === "POST") {
    return next();
  }

  if (req.path === "/api/users/login" && req.method === "POST") {
    return next();
  }

  return auth.authenticateToken(req, res, next);
}

app.use(authenticateUnlessRegisterOrLogin);

const server = app.listen(port, () => {
  console.log(`Server Is Running on Port: ${port}`);
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("Mongodb Connection success!");
});

let userAuth = require("./routes/user");
app.use("/api/users", userAuth);

let product = require("./routes/product");
app.use("/api/products", product);

let order = require("./routes/order");
app.use("/api/orders", order);

let review = require("./routes/review");
app.use("/api/reviews", review);

let favourite = require("./routes/favourite");
app.use("/api/favourites", favourite);

let category = require("./routes/category ");
app.use("/api/categories", category);