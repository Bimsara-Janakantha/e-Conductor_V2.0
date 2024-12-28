import createHttpError from "http-errors";
import { db } from "../../db.js";

// Request bus location
const Trk1 = async (req, res, next) => {
  const { data } = req.query;
  console.log("\nFind Bus: ", data);

  try {
    const sql = `SELECT 
                    JSON_OBJECT(
                        'lat', lat,
                        'lng', lng,
                        'speed', speed
                    ) AS location
                FROM 
                    BUS_LOCATIONS
                WHERE 
                    regNo = ?
            `;
    const [result] = await db.query(sql, data);
    console.log("Results: ", result);

    if (result.length < 1) {
      console.log("Failed to get current location!");
      throw createHttpError(503, "Failed to get current location!");
    }

    res.status(200).json(result[0].location);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default Trk1;
