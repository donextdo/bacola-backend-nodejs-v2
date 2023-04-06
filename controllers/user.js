const bcrypt = require("bcryptjs");
const { request } = require("express");
const User = require("../models/user");
const auth = require("../middlewares/jwt");

//register new user
const register = async (req, res) => {
  const userName = req.body.userName;
  const email = req.body.email;
  const pwd = req.body.password;
  const isFavourite = req.body.isFavourite;

  const salt = bcrypt.genSaltSync(10);
  const password = bcrypt.hashSync(pwd, salt);

  const user = new User({
    userName,
    email,
    password,
    isFavourite,
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
    const user = await User.findOne({ email: email });

    if (user) {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = auth.generateAccessToken(email);
        return res.status(200).send({ ...user.toJSON(), token });
      } else {
        return res.status(400).send({
          message: "Such user does not exist check your credentials ",
        });
      }
    } else {
      return res.status(404).send({ message: "Such user does not exist" });
    }
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Such user does not exist check your credentials" });
  }
};

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
  const email = req.params.email;

  try {
    let user = await User.findOne({
      email: email,
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
  const email = req.params.email;
  const password = req.params.pwd;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const updatePassword = bcrypt.hashSync(password, salt);

      const newUser = {
        userName: user.userName,
        email: user.email,
        password: updatePassword,
        isFavourite: user.isFavourite,
      };

      try {
        const response = await User.findOneAndUpdate({ email: email }, newUser);
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
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  const password = user.password;

  const updateUser = {
    userName: req.body.userName,
    email: req.body.email,
    password: password,
    isFavourite: req.body.isFavourite,
  };

  try {
    const response = await User.findOneAndUpdate({ email: email }, updateUser);
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

const updateBillingAddress = async (req, res) => {
  const email = req.params.email;
  const user = await User.findOne({ email: email });
  const password = user.password;

  const updateBillingAddress = {
    userName: req.body.userName,
    email: req.body.email,
    password: password,
    isFavourite: req.body.isFavourite,
    billingAddress: req.body.billingAddress,
  };

  try {
    const response = await User.findOneAndUpdate(
      { email: email },
      updateBillingAddress
    );
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

module.exports = {
  register,
  login,
  getAllUsers,
  getOneUser,
  updateUserPassword,
  updateUser,
  updateBillingAddress,
};
