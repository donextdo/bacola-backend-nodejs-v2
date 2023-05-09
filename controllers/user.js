const bcrypt = require("bcryptjs");
const { request } = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const auth = require("../middlewares/jwt");

//register new user
const register = async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const pwd = req.body.password;
  const whishList = req.body.whishList;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const companyName = req.body.companyName;
  const billingAddress = req.body.billingAddress;
  const shippingAddress = req.body.shippingAddress;

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(pwd, salt);

  const user = new User({
    userName,
    email,
    password,
    whishList,
    firstName,
    lastName,
    companyName,
    billingAddress,
    shippingAddress,
  });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).send({ message: "User Already Exists" });
    } else {
      let response = await user.save();
      if (response) {
        return res.status(201).send({ message: "New User registered" });
      } else {
        return res.status(500).send({ message: "Internal server error" });
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while registering a user" });
  }
};

//login user
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });

    if (user) {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = auth.generateAccessToken(email);
        return res.status(200).send({ ...user.toJSON(), token });
      } else {
        return res.status(400).send({
          message: "Incorrect password for the provided email or username ",
        });
      }
    } else {
      return res.status(404).send({ message: "Such user does not exist" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ message: "Such user does not exist check your credentials" });
  }
};

// const login = async (req, res) => {
//   const usernameoremail = req.body.usernameoremail;
//   const password = req.body.password;

//   try {
//     const user = await User.findOne({
//       $or: [{ email: usernameoremail }, { userName: usernameoremail }],
//     });

//     if (user) {
//       if (bcrypt.compareSync(password, user.password)) {
//         const token = auth.generateAccessToken(user.email);
//         return res.status(200).send({ ...user.toJSON(), token });
//       } else {
//         return res.status(400).send({
//           message: "Incorrect password for the provided email or username",
//         });
//       }
//     } else {
//       return res.status(404).send({ message: "Invalid email or username" });
//     }
//   } catch (err) {
//     console.error(err);
//     return res.status(500).send({
//       message:
//         "An error occurred while trying to log in. Please try again later.",
//     });
//   }
// };

const getAllUsers = async (req, res) => {
  try {
    let users = await User.find();
    if (users) {
      return res.json(users);
    } else {
      return res.status(404).send({ message: "Error on retrieving users" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const getOneUser = async (req, res) => {
  const id = req.params.id;

  try {
    let user = await User.findOne({
      _id: id,
    });
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).send({ message: "No such user found" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const updateUserPassword = async (req, res) => {
  const id = req.params.id;
  const password = req.params.pwd;

  try {
    const user = await User.findOne({ id });
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const updatePassword = bcrypt.hashSync(password, salt);

      const newUser = {
        userName: user.userName,
        email: user.email,
        password: updatePassword,
        whishList: user.whishList,
      };

      try {
        const response = await User.findOneAndUpdate({ _id: id }, newUser);
        if (response) {
          return res
            .status(200)
            .send({ message: "Successfully updated Password" });
        } else {
          return res.status(500).send({ message: "Internal server error" });
        }
      } catch (err) {
        return res
          .status(400)
          .send({ message: "Unable to update recheck your email" });
      }
    } else {
      return res
        .status(404)
        .send({ message: "No such user with entered email" });
    }
  } catch (err) {
    return res.status(404).send({ message: "No such user with entered email" });
  }
};

const updateUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  const password = user.password;

  const updateUser = {
    id: req.params.id,
    userName: req.body.userName,
    email: req.body.email,
    password: password,
    whishList: req.body.whishList,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    displayName: req.body.displayName,
    billingAddress: req.body.billingAddress,
    shippingAddress: req.body.shippingAddress,
  };

  try {
    const response = await User.findOneAndUpdate({ _id: id }, updateUser);
    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully updated User Details" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Unable to update recheck your email" });
  }
};

const updateWishList = async (req, res) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: id });
  const userName = user.userName;
  const password = user.password;
  const email = user.email;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const companyName = user.companyName;
  const displayName = user.displayName;
  const billingAddress = user.billingAddress;
  const shippingAddress = user.shippingAddress;

  const updateUser = {
    id: req.params.id,
    userName: userName,
    email: email,
    password: password,
    whishList: req.body.whishList,
    firstName: firstName,
    lastName: lastName,
    companyName: companyName,
    displayName: displayName,
    billingAddress: billingAddress,
    shippingAddress: shippingAddress,
  };

  try {
    const response = await User.findOneAndUpdate({ _id: id }, updateUser);
    if (response) {
      return res
        .status(200)
        .send({ message: "Successfully updated favourite Details" });
    } else {
      return res.status(500).send({ message: "Internal server error" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Unable to update recheck your details" });
  }
};

const getOneUserByEmail = async (req, res) => {
  const { usernameOrEmail } = req.params;
  try {
    const user = await User.findOne({
      $or: [{ userName: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (user) {
      return res.status(200).send({ message: "User Exist" });
    } // Return null if no user found
    else if (!user) {
      return res.status(400).send({ message: "Please check your credentials" });
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal server error" });
  }
};

const addWishList = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    const products = req.body.products;

    const productList = products.map((p) => ({
      productId: p.productId,
      date: p.date,
      front: p.front,
      title: p.title,
      price: p.price,
      quantity: p.quantity,
    }));

    user.whishList.push(...productList);

    await user.save();

    res.status(200).json({ message: "Products added to wishlist" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  register,
  login,
  getAllUsers,
  getOneUser,
  updateUserPassword,
  updateUser,
  updateWishList ,
  getOneUserByEmail,
  addWishList,
};

