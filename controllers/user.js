const ejs = require('ejs')
const fs = require('fs');

const bcrypt = require("bcryptjs");
const { request } = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const auth = require("../middlewares/jwt");
const nodemailer = require('nodemailer');
const path = require('path');
const { fileURLToPath } = require('url');
const sendEmail = require('../utils/sendEmails');
const express = require('express');
const jwt = require('jsonwebtoken');


// const verifyEmailTemplatePath = path.resolve(__dirname, '../utils/verifyemail.ejs');
// const verifyEmailTemplate = fs.readFileSync(verifyEmailTemplatePath, 'utf-8');

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
const registerr = async (req, res) => {
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

      // const verificationLink = `/email-verification/`

      // const data = { verifyUrl: verificationLink };
      // const renderedTemplate = ejs.render(verifyEmailTemplate, data);

      // await sendEmail(
      //   'Verify Your Account with Bloonsoo',
      //   user.email,
      //   renderedTemplate
      // )

      const token = jwt.sign({ email }, 'YOUR_SECRET_KEY', { expiresIn: '1h' });

      const transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 587,
        secure: false,
        auth: {
            user: 'noreply@bloonsoo.com',
            pass: '746)PjJfA%2nEns'
        }
    })

      const verificationEmail = {
        from: 'noreply@bloonsoo.com',
        to: email,
        subject: 'Email Verification',
        html: `
    <p>Please click the following link to verify your email:</p>
    <a href="http://localhost:3000/api/users/verify?token=${token}">Verify Email</a>
  `
      };

      await transporter.sendMail(verificationEmail);

    // Save the user details in the database (e.g., MongoDB)

    res.status(200).json({ message: 'Signup successful. Please check your email for verification.' });


      // let response = await user.save();

      // if (response) {
      //   return res.status(201).send({ message: "New User registered" });
      // } else {
      //   return res.status(500).send({ message: "Internal server error" });
      // }
    }
  } catch (err) {
    console.log(err);
    return res.status(400).send({ message: "Error while registering a user" });
  }
};

const verifyEmail = async (req, res, next) => {
  try {

    const token = req.body.token
    const verifyToken = await VerifyToken.findOne({
      token
    })

    if (!verifyToken) {
      throw new NotFoundError(`INVALID_TOKEN`)
    }

    if (verifyToken.isCompleted) {
      throw new ForbiddenError(`TOKEN_ALREADY_COMPLETED`)
    }

    await VerifyToken.findOneAndUpdate(
      { token: token },
      {
        $set: {
          isCompleted: true
        }
      },
      {
        runValidators: true
      }
    )

    await User.findByIdAndUpdate(
      verifyToken.user.toString(),
      {
        $set: {
          isEmailVerified: true
        }
      },
      {
        runValidators: true
      }
    )

    res.status(200).json({
      success: true,
      message: 'EMAIL_VERIFIED_SUCCESSFULLY'
    })

  }
  catch (error) {
    next(error)
  }
}


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

const getVerifyEmail = async (req, res) => {
  // const id = req.params.id;
  
   try {
    console.log("hi")
      const { token } = req.query;
      
      // Verify the token
      jwt.verify(token, 'YOUR_SECRET_KEY', async (err, decoded) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ error: 'Invalid or expired token.' });
        }
  
        const { email } = decoded;
  
        // Update the user's email verification status in the database (e.g., MongoDB)
        // Set the emailVerified field to true for the user with the given email
  
        // Respond with a success message
        return res.status(200).send({ message: 'Email verification successful.' });
      });
    } catch (err) {
      return res.status(500).send({ message: "An error occurred during email verification" });
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
    console.log("user", user);
    const products = req.body.whishList;

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

const deleteFromWishList = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    // Remove the product from the wishlist array
    user.whishList = user.whishList.filter(
      (product) => product.productId !== req.params.productId
    );

    await user.save();

    res.status(200).json({ message: "Product removed from wishlist" });
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
  getOneUserByEmail,
  addWishList,
  deleteFromWishList,
  verifyEmail,
  getVerifyEmail
};

