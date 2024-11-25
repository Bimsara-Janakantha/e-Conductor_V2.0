import { db } from "../../db.js";
import createHttpError from "http-errors";

// Requesting ticket history from db
const Tkt1 = async (req, res, next) => {
  const { data } = req.body;

  console.log("\nTkt1:: Requesting ticket history of ", data);

  const query = `
          SELECT 
            JSON_OBJECT(
                'available', (
                    SELECT COUNT(*)
                    FROM TICKET t2
                    WHERE t2.passengerID = t1.passengerID AND t2.status = 'Available'
                ),
                'tickets', JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', LPAD(ticketNo, 7, '0'),
                        'date', issuedDate,
                        'from', fromStop.name,
                        'to', toStop.name,
                        'status', status,
                        'amount', FORMAT(ticketPrice, 2)
                    )
                )
            ) AS result
          FROM TICKET t1
          JOIN 
            BUSSTOP_NAMES fromStop ON t1.fromLocation = fromStop.nameID 
          JOIN 
            BUSSTOP_NAMES toStop ON t1.toLocation = toStop.nameID
          WHERE passengerID = ?
          GROUP BY passengerID;
        `;

  try {
    const [results] = await db.query(query, data);

    if (results.length > 0) {
      console.log("All Tickets: ", results[0].result);
      res.status(200).json(results[0].result);
    } else {
      const serverResponse = {
        available: 0,
        tickets: [],
      };
      console.log("All Tickets: ", serverResponse);
      res.status(200).json(serverResponse);
    }
  } catch (err) {
    console.error("Error in finding ticket history:", err);
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Tkt1;

/* db.query(query, data, (err, results) => {
    if (err) {
      console.error("Error in finding ticket history:", err);
      next(createHttpError(503, "Database connection is failed!"));
    }
    if (results.length > 0) {
      console.log("All Tickets: ", results[0].result);
      res.status(200).json(results[0].result);
    } else if (results.length === 0) {
      const serverResponse = {
        available: 0,
        tickets: results,
      };
      console.log("All Tickets: ", serverResponse);
      res.status(200).json(serverResponse);
    } else {
      console.log(`Tickets not found belongs to userID: ${data}`);
      next(createHttpError(500, "Tickets Error!"));
    }
  }); */
