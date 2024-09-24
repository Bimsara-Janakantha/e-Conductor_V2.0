import express from "express";
import { db } from "../db.js"; // Ensure this is correctly pointing to your database module
import { generateOTP, sendOTP } from "../otp.js";

const router = express.Router();

// OTP handling
router.post("/otp", async (req, res) => {
  const { type, data } = req.body;

  // Generate and send OTP based on the request type
  if (type === "requestOTP") {
    if (!data.mobile && !data.email) {
      return res.status(400).json({ error: "Missing required data" });
    } else {
      let otp = generateOTP();

      try {
        await sendOTP(data.email, otp); // Ensure sendOTP is async if necessary
      } catch (error) {
        console.error("Error sending OTP:", error);
        return res.status(500).json({ error: "Failed to send OTP" });
      }

      console.log(
        `New Request:: type: ${type} Mobile Number: ${data.mobile} Email: ${data.email} OTP: ${otp}`
      );

      const check_sql = `SELECT otpID FROM OTP_TABLE WHERE contactNo = ?`;

      db.query(check_sql, data.mobile, (err, result) => {
        if (err) {
          console.error("Error querying OTP_TABLE:", err);
          return res.status(500).json({ error: "Database query error" });
        }

        if (result.length > 0) {
          const update_otp_sql = `UPDATE OTP_TABLE SET otp = ? WHERE contactNo = ?`;
          const values = [otp, data.mobile];

          db.query(update_otp_sql, values, (err) => {
            if (err) {
              console.error("Error updating OTP:", err);
              return res.status(500).json({ error: "Failed to update OTP" });
            } else {
              return res.json({ message: "OTP updated successfully" });
            }
          });
        } else {
          const new_entry_sql = `INSERT INTO OTP_TABLE (otp, contactNo, email) VALUES (?, ?, ?)`;
          const values = [otp, data.mobile, data.email];

          db.query(new_entry_sql, values, (err) => {
            if (err) {
              console.error("Error inserting OTP:", err);
              return res.status(500).json({ error: "Failed to insert OTP" });
            } else {
              return res.json({ message: "OTP inserted successfully" });
            }
          });
        }
      });
    }
  } else if (type === "verifyOTP") {
    if (!data.email || !data.value) {
      return res.status(400).json({ error: "Missing required data" });
    } else {
      const email = data.email;

      const sql = `SELECT otp FROM OTP_TABLE WHERE email = ? LIMIT 1`;

      db.query(sql, email, (err, response) => {
        if (err) {
          console.error("Error querying OTP_TABLE:", err);
          return res.status(500).json({ error: "Database query error" });
        }

        if (response.length === 0) {
          return res.status(404).json({ error: "OTP not found" });
        }

        const isValidOTP = data.value === response[0].otp;

        if (isValidOTP) {
          // Delete the OTP after validation
          const delete_sql = `DELETE FROM OTP_TABLE WHERE email = ?`;
          db.query(delete_sql, email, (err) => {
            if (err) {
              console.error("Error deleting OTP:", err);
            }
          });
        }

        res.json({ verified: isValidOTP });
      });

      console.log(
        `Authentication:: type: ${type} Data: ${JSON.stringify(
          data
        )} User OTP: ${data.value}`
      );
    }
  } else {
    res.status(400).json({ error: "Invalid request type" });
  }
});

export default router;
