const Subscribe = require("../models/subscribe");
const EmailService = require("../utils/EmailService");
const nodemailer = require("nodemailer");

const addSubscribe = async (req, res) => {
  try {
    const email = req.body.email;
    const date = new Date();
    if (email) {
      const subscribe = new Subscribe({
        email,
        date,
      });
      let response = await subscribe.save();
      if (response) {
        const verificationEmail = {
          from: process.env.EMAIL_FROM,
          to: email,
          subject: "Thanks for subscribing!",
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
            <h1>Thanks for subscribing!</h1>
              <p>You have successfully subscribed to our newsletter.</p>
              <p>Thank you for choosing Bacola. We look forward to serving you!</p>
              <p>Best regards,</p>
             <p>The Bacola Team</p>
            </div>
          </body>
        </html>
  
      `,
        };
        await EmailService.sendEmail(
          email,
          verificationEmail.subject,
          verificationEmail.html
        );

        return res.status(200).send({ message: "Subscription successful" });
      } else {
        return res.status(400).send({ message: "Email not send" });
      }
    }
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};

const getAllCoupen = async (req, res) => {
  //   try {
  //     let coupons = await Coupon.find();
  //     if (coupons) {
  //       return res.json(coupons);
  //     } else {
  //       return res
  //         .status(404)
  //         .send({ message: "Error occured when retrieving coupons" });
  //     }
  //   } catch (err) {
  //     return res.status(500).send({ message: "Internal server error" });
  //   }
};

module.exports = {
  addSubscribe,
  getAllCoupen,
};
