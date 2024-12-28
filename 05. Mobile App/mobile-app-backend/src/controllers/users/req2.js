import createHttpError from "http-errors";
import { db } from "../../db.js";

// Check user availability from DB (request coming from signup page)
const Req2 = async (req, res, next) => {
  const { data } = req.body;

  console.log("\nREQ 2:: New user availability checking.", data);

  const sql = `SELECT userID FROM USERS WHERE email = ? OR mobile = ?`;
  const values = [data.email, data.mobile];

  try {
    const [result] = await db.query(sql, values);
    console.log(
      `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
    );

    if (result.length > 0) {
      console.log("User already exists.");
      res.status(200).json({
        success: false,
        message: "User with this email or mobile already exists.",
      });
    } else {
      console.log("User is available.");
      res.status(200).json({
        success: true,
        message: "User is available.",
      });
    }
  } catch (err) {
    console.log(err.message);
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Req2;
