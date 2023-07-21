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
const logger = require("../utils/logger");

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
      logger.warn("User already exists");
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
        logger.info(
          '"Sign-up successful. Please check your email for verification."'
        );
        return res.status(200).json({
          message:
            "Sign-up successful. Please check your email for verification.",
        });
      } catch (error) {
        // Log an error
        logger.error("An error occurred:", error);
        await User.findOneAndUpdate({ email }, { isemailverify: true });

        return res.status(200).json({
          message: "Sign-up successful. Manual email verification required.",
          instructions:
            "Please check your email for verification instructions or contact support for assistance.",
        });
      }
    }

    return res
      .status(500)
      .json({ message: "Sign-up failed. Please try again later." });
  } catch (error) {
    // Log an error
    logger.error("An error occurred:", error);

    return res.status(400).send({ message: "Error while registering a user" });
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

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Email Verification</title>
        <style>
          /* Copy the CSS styles from the original template here */
          /* ... (existing CSS styles) ... */

          /* Add the CSS styles for the new HTML */
          body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.5;
            background-color: #fff;
          }
          .container {
            width: 90%;
            margin: 0 auto;
            background-color: #f1f1f1;
            padding: 20px 30px;
            border-radius: 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          }
          h1 {
            color: #3A1C61;
            font-size: 1.5rem;
          }
          p {
            color: #333;
            font-size: 1rem;
            letter-spacing: .6px;
            font-weight: 500;
          }
          a {
            width: max-content;
            background-color: #007bff;
            border: none;
            color: #fff !important;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 16px;
            display: block;
            cursor: pointer;
            text-decoration: none;
          }
          a:hover {
            background-color: #0056b3;
          }
          /* Add any additional CSS styles if required for the new HTML */
        </style>
      </head>
      <body>
        <div class="container">
        <h1>Verify Your Account with Bacola</h1>
          <p>If you did not register for Bacola, please ignore this email.</p>

          <p>Please click the following link to verify your email:</p>
          <a href="${frontendBaseURL}/successpage?token=${token}">Verify Email</a>
          
          <p>Thank you for choosing Bacola. We look forward to serving you!</p> 

          <p>Best regards,</p> 
<p>The Bacola Team</p>
        </div>
      </body>
    </html>
      
    `,
  };

  try {
    await EmailService.sendEmail(
      email,
      verificationEmail.subject,
      verificationEmail.html
    );
  } catch (error) {
    throw new Error("Failed to send email");
  }
};

//verify tocken and update user verify status
const VerifyEmailByUser = async (req, res) => {
  try {
    console.log("token : ", req.params.token);
    // Verify the token
    const decodedToken = jwt.verify(req.params.token, process.env.SECRET_KEY);
    // Update the user's verification status in your database
    const { email } = decodedToken;
    await User.findOneAndUpdate({ email }, { isemailverify: true });

    // Redirect the user to a success page
    res.redirect(process.env.FRONTEND_BASE_URL);
  } catch (error) {
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
          const token = auth.generateAccessToken(user._id);
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

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({
      email: email,
    });
    if (email) {
      const token = auth.generateAccessToken(user._id);

      const frontendBaseURL = `http://localhost:3001/changepassword?token=${token}`;

      const verificationEmail = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Reset Password",
        html: `

        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Email Verification</title>
            <style>
              /* Copy the CSS styles from the original template here */
              /* ... (existing CSS styles) ... */
    
              /* Add the CSS styles for the new HTML */
              body {
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.5;
                background-color: #fff;
              }
              .container {
                width: 90%;
                margin: 0 auto;
                background-color: #f1f1f1;
                padding: 20px 30px;
                border-radius: 10px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              }
              h1 {
                color: #3A1C61;
                font-size: 1.5rem;
              }
              p {
                color: #333;
                font-size: 1rem;
                letter-spacing: .6px;
                font-weight: 500;
              }
              a {
                width: max-content;
                background-color: #007bff;
                border: none;
                color: #fff !important;
                padding: 10px 20px;
                border-radius: 5px;
                font-size: 16px;
                display: block;
                cursor: pointer;
                text-decoration: none;
              }
              a:hover {
                background-color: #0056b3;
              }
              /* Add any additional CSS styles if required for the new HTML */
            </style>
          </head>
          <body>
            <div class="container">
            <h1>Reset your Bacola Account Password</h1>
            <p>If you did not register for Bacola, please ignore this email.</p>
    
              <p>Please click the following link to verify your email:</p>
              <a href="${frontendBaseURL}">Change Password</a>              
              <p>Thank you for choosing Bacola. We look forward to serving you!</p> 
    
              <p>Best regards,</p> 
    <p>The Bacola Team</p>
            </div>
          </body>
        </html>
        
      `,
      };

      // Send the email
      try {
        const emailSent = await EmailService.sendEmail(
          email,
          verificationEmail.subject,
          verificationEmail.html
        );
        if (emailSent) {
          return res.status(403).send({ message: "Please verify your email" });
        }
      } catch (error) {
        // throw new Error("Failed to send email");
        return res.status(500).send({ message: "Failed to send email" });
      }
    }
  } catch (error) {
    return res.status(404).send({ message: "Email is incorrect" });
  }
};

const updateUserPassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findById(id);
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);

      user.password = hashedPassword;

      try {
        const updatedUser = await user.save();
        return res
          .status(200)
          .send({ message: "Successfully updated password" });
      } catch (error) {
        return res.status(500).send({ message: "Internal server error" });
      }
    } else {
      return res
        .status(404)
        .send({ message: "No user found with the provided ID" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Internal server error" });
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
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else {
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
  forgotPasswordController,
};
