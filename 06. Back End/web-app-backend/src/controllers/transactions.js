import createHttpError from "http-errors";
import { db } from "../db.js";

export const transactions = (req, res, next) => {
  console.log("Transaction Request");
  const { type, data } = req.body;

  // Requesting transaction history from db
  if (type === "Trans1") {
    console.log(`History Request:: userID: ${data}`);

    // Edit here with suitable query
    const query = `
        SELECT 
          JSON_OBJECT(
              'credits', u.credits,
              'transaction', JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'id', LPAD(t.transactionID, 7, '0'),
                      'date', t.date,
                      'time', t.time,
                      'description', t.type,
                      'amount', FORMAT(t.amount, 2)
                  )
              )
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

    db.query(query, data, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        next(createHttpError(503, "Database connection is failed!"));
      }

      // Data available
      if (results.length > 0) {
        console.log(
          `Server Replies to ${data} as ${JSON.stringify(results[0].result)}`
        );
        res.status(200).json(results[0].result);
      }
      // Data not available
      else {
        console.log(`Transaction not found with ID: ${data}`);
        res.status(204).send("Transaction not found");
      }
    });
  }
};
