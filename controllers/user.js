const bcrypt = require("bcryptjs");
const { request } = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const auth = require("../middlewares/jwt");
const nodemailer = require("nodemailer");
const path = require("path");
const { fileURLToPath } = require("url");
const sendEmail = require("../utils/sendEmails");
const express = require("express");
const jwt = require("jsonwebtoken");
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const rateLimit = require("express-rate-limit");
const EmailService = require("../utils/EmailService");
const logger = require('../utils/logger');


//register new user
// const register = async (req, res) => {
//   const userName = req.body.userName;
//   const email = req.body.email;
//   const pwd = req.body.password;
//   const whishList = req.body.whishList;
//   const firstName = req.body.firstName;
//   const lastName = req.body.lastName;
//   const companyName = req.body.companyName;
//   const billingAddress = req.body.billingAddress;
//   const shippingAddress = req.body.shippingAddress;

//   const salt = bcrypt.genSaltSync(10);
//   const password = bcrypt.hashSync(pwd, salt);

//   const user = new User({
//     userName,
//     email,
//     password,
//     whishList,
//     firstName,
//     lastName,
//     companyName,
//     billingAddress,
//     shippingAddress,
//   });

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       res.status(400).send({ message: "User Already Exists" });
//     } else {
//       let response = await user.save();

//       if (response) {
//         // verify email link send
//        const emailSent = sendEmailVerification(email);
//        if (emailSent) {
//         res.status(200).json({
//           message: "Sign-up successful.",
//         });
//       } else {
//         // Handle the case where email sending failed
//         // For example, you can redirect the user to the sign-up page again
//         // res.redirect('/signup');
//     res.redirect(process.env.FRONTEND_BASE_URL);

//       }
//         // call the verify endpoint

//         // res.status(200).json({
//         //   message: "Sign-up successful.",
//         // });
//       } else {
//         res
//           .status(500)
//           .json({ message: "Sign-up failed. Please try again later." });
//       }
//     }
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send({ message: "Error while registering a user" });
//   }
// };

// Register new user
const register = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      whishList,
      firstName,
      lastName,
      companyName,
      billingAddress,
      shippingAddress,
    } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      userName,
      email,
      password: hashedPassword,
      whishList,
      firstName,
      lastName,
      companyName,
      billingAddress,
      shippingAddress,
    });

    const savedUser = await user.save();

    if (savedUser) {
      try {
        await sendEmailVerification(email);
        return res.status(200).json({
          message: "Sign-up successful. Please check your email for verification.",
        });
      } catch (error) {
        // Log an error
        logger.error('An error occurred:', error);
        console.log("Error while sending verification email: ", error);
        console.log("Manual verification required for email:", email);
        await User.findOneAndUpdate({ email }, { isemailverify: true });

        return res.status(200).json({
          message: "Sign-up successful. Manual email verification required.",
          instructions: "Please check your email for verification instructions or contact support for assistance.",
        });
      }
    }

    return res
      .status(500)
      .json({ message: "Sign-up failed. Please try again later." });
  } catch (err) {
    // Log an error
    logger.error('An error occurred:', error);
    console.error("Error while registering a user:", err);
    return res
      .status(400)
      .send({ message: "Error while registering a user" });
  }
};


const sendEmailVerification = async (email) => {
  const token = jwt.sign({ email }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });

  const frontendBaseURL = process.env.FRONTEND_BASE_URL;

  const verificationEmail = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Email Verification",
    html: `
      <p>Please click the following link to verify your email:</p>
      <a href="${frontendBaseURL}/api/users/verify/${token}">Verify Email</a>
    `,
  };

  try {
    await EmailService.sendEmail(email, verificationEmail.subject, verificationEmail.html);
  } catch (error) {
    console.log("Error while sending the email: ", error);
    throw new Error("Failed to send email");
  }
};

//send email for the verification
// const sendEmailVerification = async (email) => {
//   const token = jwt.sign({ email }, process.env.SECRET_KEY, {
//     expiresIn: "1h",
//   });
//   // const token = "token";
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//   });
//   const frontendBaseURL = process.env.FRONTEND_BASE_URL;
//   console.log("verify the email: ", email);
//   const verificationEmail = {
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject: "Email Verification",
//     html: `
//     <p>Please click the following link to verify your email:</p>
//     <a href="http://localhost:3000/api/users/verify/${token}">Verify Email</a>
//     `,
//   };
//   console.log(`http://localhost:3000/api/users/verify/${token}`);
//   console.log("verify the email: ", verificationEmail);
//   try {
//     await transporter.sendMail(verificationEmail);
//     return true;
//   } catch (error) {
//     console.log("error while sending the email: ", error);
//     const response = await User.findOneAndUpdate(
//       { email },
//       { isemailverify: true }
//     );
//     if (response) {
     
      
   
//       console.log("Sign up Done");
//     }
//     return false
//   }
// };

//verify tocken and update user verify status
const VerifyEmailByUser = async (req, res) => {
  try {
    // Verify the token
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET_KEY);
    console.log("decodedToken: ", decodedToken);
    // Update the user's verification status in your database
    const { email } = decodedToken;
    await User.findOneAndUpdate({ email }, { isemailverify: true });

    // Redirect the user to a success page
    res.redirect(process.env.FRONTEND_BASE_URL);
  } catch (error) {
    console.error("Error during verification:", error);
    res.redirect("/verification/error");
  }
};

//login user
const login = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await User.findOne({ email });

    if (user) {
      if (user.isemailverify == true) {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = auth.generateAccessToken(email);
          return res.status(200).send({ ...user.toJSON(), token });
        } else {
          return res.status(400).send({
            message: "Incorrect password for the provided email or username ",
          });
        }
      } else {
        return res.status(403).send({ message: "Please verify your email" });
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
  //  try {
  //   console.log("hi")
  //     const { token } = req.query;
  //     // Verify the token
  //     jwt.verify(token, 'YOUR_SECRET_KEY', async (err, decoded) => {
  //       if (err) {
  //         console.log(err);
  //         return res.status(400).json({ error: 'Invalid or expired token.' });
  //       }
  //       const { email } = decoded;
  //       // Update the user's email verification status in the database (e.g., MongoDB)
  //       // Set the emailVerified field to true for the user with the given email
  //       // Respond with a success message
  //       return res.status(200).send({ message: 'Email verification successful.' });
  //     });
  //   } catch (err) {
  //     return res.status(500).send({ message: "An error occurred during email verification" });
  //   }
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

// const addWishList = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     console.log("user", user);
//     const products = req.body.whishList;

//     const productList = products.map((p) => ({
//       productId: p.productId,
//       date: p.date,
//       front: p.front,
//       title: p.title,
//       price: p.price,
//       quantity: p.quantity,
//     }));

//     user.whishList.push(...productList);

//     await user.save();

//     res.status(200).json({ message: "Products added to wishlist" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

const addWishList = async (req, res) => {
  try {

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    const userEmail = decodedToken.data;

    // Find the user based on the email
     let user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user = await User.findById(req.params.id);
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
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }else{
      console.log("error is $err", err);
    }
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
  VerifyEmailByUser,
  getVerifyEmail,
};
