import createHttpError from "http-errors";
import { db } from "../../db.js";

// Request personal infomation from booking page
const Req8 = async (req, res, next) => {
  const { userId, total } = req.body.data;
  console.log(
    `\nREQ 8:: Booking page user data request. userID: ${userId}  total: ${total}`
  );

  const sql = `
    SELECT 
        CONCAT(fName, ' ', lName) AS name, 
        mobile, 
        email, 
        (SELECT value FROM GENERAL WHERE item = 'discountPercentage') AS discount, 
        (SELECT value FROM GENERAL WHERE item = 'maxDiscount') AS maxDiscount 
    FROM USERS 
    WHERE UserID = ? AND userState != 'banned';
    `;

  try {
    const [result] = await db.query(sql, userId);

    if (result.length > 0) {
      const { name, mobile, email, discount, maxDiscount } = result[0];

      // Calculate discount
      const calDiscount = parseFloat(discount) * total * 0.01;

      // Final discount
      const totalDiscount =
        calDiscount < parseFloat(maxDiscount) ? calDiscount : maxDiscount;

      // Final data set
      const final = {
        name,
        mobile,
        email,
        discount: totalDiscount.toFixed(2),
        totalPrice: (parseFloat(total) - totalDiscount).toFixed(2),
      };

      console.log("Final data: ", final);
      res.status(200).json(final);
    } else {
      next(createHttpError(404, "User not found!"));
    }
  } catch (err) {
    console.log(err.message);
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Req8;

/*  db.query(sql, userId, (err, result) => {
    if (err) {
      console.log(err.message);
      next(createHttpError(503, "Database connection is failed!"));
    } else {
      if (result.length > 0) {
        //console.log("User Data:", result[0]);
        const { name, mobile, email, discount, maxDiscount } = result[0];

        // Calculated discount
        const calDiscount = parseFloat(discount) * total * 0.01;

        // Final discount
        const totalDiscount =
          calDiscount < parseFloat(maxDiscount) ? calDiscount : maxDiscount;

        // Final data set
        const final = {
          name,
          mobile,
          email,
          discount: totalDiscount.toFixed(2),
          totalPrice: (parseFloat(total) - totalDiscount).toFixed(2),
        };

        console.log("Final data: ", final);
        res.status(200).json(final);
      } else {
        next(createHttpError(404, "User not found!"));
      }
    }
  }); */
