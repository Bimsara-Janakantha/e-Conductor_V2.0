import { db } from "../../db.js";

import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import createHttpError from "http-errors";

// Generate a 6-digit OTP
async function generateOTP() {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
}

// Send the OTP via email using Nodemailer
async function sendOTP(email, OTP) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.COMPANY_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.COMPANY_EMAIL,
    to: email,
    subject: "Your OTP",
    text: `Your OTP is: ${OTP}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

// Save OTP in the database, either updating or inserting it
async function saveOTP(OTP, email, mobile, res, next) {
  try {
    const check_sql = `
      INSERT INTO OTP_TABLE (email, contactNo, otp) 
      VALUES (?, ?, ?) 
      ON DUPLICATE KEY UPDATE otp = VALUES(otp);
    `;

    await db.query(check_sql, [email, mobile, OTP]);

    console.log("OTP saved successfully!");
    res.status(201).send("success");
  } catch (error) {
    console.log(error);
    next(createHttpError(502, "OTP is failed!"));
  }
}

/* END POINT HANDLING */

// Login OTP (send OTP to email and mobile)
export const login = async (req, res, next) => {
  console.log("\n\nLogin OTP endpoint");
  const { email, mobile } = req.body.data;

  // Here you might want to generate an OTP and save it
  let OTP = await generateOTP();

  try {
    await sendOTP(email, OTP);

    console.log(`
      New Login OTP Request::\n
      Mobile Number: ${mobile}   
      Email: ${email}  
      OTP:: ${OTP}\n
    `);

    await saveOTP(OTP, email, mobile, res, next);
  } catch (error) {
    console.error("Error occurred during OTP processing:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

// Signup OTP (send OTP to mobile)
export const signup = async (req, res, next) => {
  console.log("\n\nSignup OTP endpoint");
  const { email, mobile } = req.body.data;

  // Here you might want to generate an OTP and save it
  let OTP = await generateOTP();

  try {
    await sendOTP(email, OTP);

    console.log(`
      New Signup OTP Request::\n
      Mobile Number: ${mobile}   
      Email: ${email}  
      OTP:: ${OTP}\n
    `);

    await saveOTP(OTP, email, mobile, res, next);
  } catch (error) {
    console.error("Error occurred during OTP processing:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

// Request OTP (send OTP to email or mobile or both according to the origin)
export const request = async (req, res, next) => {
  console.log("\n\nRequest OTP endpoint");
  const { email, mobile, origin } = req.body.data;

  /* 
    Need to update: Handle according to the origin
    
    origin :
      email       => Verify email only
      mobile      => Verify mobile only
      emailMobile => Verify email & mobile
  */

  // Here you might want to generate an OTP and save it
  let OTP = await generateOTP();

  try {
    await sendOTP(email, OTP);

    console.log(`
      New OTP Request ::\n
      Mobile Number: ${mobile}   
      Email: ${email}  
      Origin: ${origin}
      OTP:: ${OTP}\n
    `);

    await saveOTP(OTP, email, mobile, res, next);
  } catch (error) {
    console.error("Error occurred during OTP processing:", error);
    next(createHttpError(500, "Internal server error"));
  }
};

// Verifying OTP
export const verify = async (req, res, next) => {
  const { mobile, email, value, origin } = req.body.data;

  console.log(
    `\nVerify user \nmobile: ${mobile}  email: ${email}  OTP: ${value} Origin: ${origin}\n`
  );

  try {
    const sql = `SELECT otp FROM OTP_TABLE WHERE email = ? AND contactNo = ? limit 1`;

    const [response] = await db.query(sql, [email, mobile]);

    console.log(`ServerOTP:${response[0].otp} | UserOTP:${value}`);
    const reply = value === response[0].otp;
    res.status(200).json({ success: reply });
    console.log("Verification is passed: ", reply);
  } catch (error) {
    console.log(err);
    next(createHttpError(502, "Database connection is failed!"));
  }
};
