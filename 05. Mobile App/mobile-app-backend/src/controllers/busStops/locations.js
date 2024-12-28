import createHttpError from "http-errors";
import { db } from "../../db.js";

// Getting bus stop locations
const BusStopLocations = async (req, res, next) => {
  const { data } = req.query;
  console.log("Requesting bus holt locations in area(s)", data);

  const sql = `
    SELECT 
        BUSSTOP_LOCATIONS.locationID AS id, 
        BUSSTOP_NAMES.name, 
        BUSSTOP_LOCATIONS.routes, 
        JSON_OBJECT('lat', BUSSTOP_LOCATIONS.lat, 'lng', BUSSTOP_LOCATIONS.lng) AS location
    FROM 
        BUSSTOP_LOCATIONS
    JOIN 
        BUSSTOP_NAMES ON BUSSTOP_LOCATIONS.nameID = BUSSTOP_NAMES.nameID
    WHERE 
        BUSSTOP_LOCATIONS.areaNumber IN (?);
  `;

  try {
    const [result] = await db.query(sql, [data]);

    console.log("Selected Bus Stops", result);
    res.status(200).json(result);
  } catch (error) {
    console.log(err.message);
    next(createHttpError(503, "Database connection is failed!"));
  }
};

export default BusStopLocations;
