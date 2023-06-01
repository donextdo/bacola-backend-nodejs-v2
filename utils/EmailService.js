// EmailService.js

const sendEmail = async (email, subject, html) => {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  
    const verificationEmail = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: subject,
      html: html,
    };
  
    try {
      await transporter.sendMail(verificationEmail);
    } catch (error) {
      console.log("Error while sending the email: ", error);
      throw new Error("Failed to send email");
    }
  };
  
  module.exports = {
    sendEmail,
  };
