import createHttpError from "http-errors";
import { db } from "../../db.js";

// Requesting transaction history from db
const Trans1 = async (req, res, next) => {
  const { data } = req.query;
  console.log("Trans1:: Request Transaction History of user: ", data);

  const query = `
        SELECT 
          JSON_OBJECT(
              'credits', u.credits,
              'transaction', 
              IF(COUNT(t.transactionID) > 0, JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'id', LPAD(t.transactionID, 7, '0'),
                      'date', t.date,
                      'time', t.time,
                      'description', t.type,
                      'amount', FORMAT(t.amount, 2)
                  )
              ), NULL)  -- If there are no transactions, return NULL
          ) AS result
        FROM 
            USERS u
        LEFT JOIN 
            TRANSACTION t ON u.UserID = t.userID
        WHERE 
            u.userID = ?
        GROUP BY 
            u.userID, u.credits;
        `;

  try {
    const [results] = await db.query(query, data);

    // Data available
    if (results.length > 0 && results[0].result.transaction !== null) {
      console.log(`Server Replies to ${data} as`, results[0].result);
      res.status(200).json(results[0].result);
    } else {
      // Data not available
      console.log(`Transaction not found with ID: ${data}`);
      next(createHttpError(404, "Transaction not found!"));
    }
  } catch (err) {
    console.error("Error executing query:", err);
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Trans1;
