import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";

// Generate a 6-digit OTP without alphabets or special characters
export const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
};

// Send OTP via email using nodemailer and return a Promise
export const sendOTP = (email, OTP) => {
  return new Promise((resolve, reject) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.COMPANY_EMAIL, // Company email from environment variable
        pass: process.env.APP_PASSWORD,  // App password from environment variable
      },
    });

    let mailOptions = {
      from: process.env.COMPANY_EMAIL,
      to: email,
      subject: "Your OTP",
      text: `Your OTP is: ${OTP}`,
    };

    // Send email using nodemailer
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending OTP:", error);
        reject(error); // Reject the Promise in case of an error
      } else {
        console.log("Email sent: " + info.response);
        resolve(info.response); // Resolve the Promise on success
      }
    });
  });
};
