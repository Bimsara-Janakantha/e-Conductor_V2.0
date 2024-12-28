// Shcedule data
import createHttpError from "http-errors";
import { db } from "../../db.js";
import { journeyDetails } from "../../utils/journey_details.js";
import calculateFare from "../../utils/busFare.js";

// Frontend send the {from:fromID, to:toID, date:date}. Then need to fetch the corresponding shedule details according to it and send to the frontend
const Sdl1 = async (req, res, next) => {
  const { data } = req.body;

  console.log("SDL1:: Requesting bus schedules according to ", data);

  try {
    // Step 1: Find routes passing through both stops
    const sql = `
      WITH RECURSIVE idx_table AS (
          SELECT 0 AS idx
          UNION ALL
          SELECT idx + 1
          FROM idx_table
          WHERE idx < (
              SELECT MAX(JSON_LENGTH(routes))
              FROM BUSSTOP_LOCATIONS
              WHERE nameID IN (?, ?)
          )
      )

      SELECT JSON_UNQUOTE(JSON_EXTRACT(routes, CONCAT('$[', idx, ']'))) AS route
      FROM BUSSTOP_LOCATIONS b
      JOIN idx_table ON idx < JSON_LENGTH(b.routes)
      WHERE b.nameID IN (?, ?)
      GROUP BY route
      HAVING COUNT(DISTINCT nameID) = 2;
      `;

    const [routes] = await db.query(sql, [
      data.from,
      data.to,
      data.from,
      data.to,
    ]);

    if (!routes.length) {
      console.log("No routes found!");
      return res.status(200).json([]);
    }

    // Step 2: Get common route array
    const commonRoutes = routes.map((route) => route.route);
    console.log("Common routes: ", commonRoutes);

    // Step 3: Get location details
    const sql2 = `
      SELECT nameID, name, CONCAT(lat, ', ', lng) AS location
      FROM BUSSTOP_NAMES 
      WHERE nameID IN (?, ?);
    `;
    const [location] = await db.query(sql2, [data.from, data.to]);

    if (location.length != 2) {
      console.log("Data not found!");
      throw createHttpError(404, "Data not found");
    }

    console.log("Details: ", location);

    let origin, destination;

    if (location[0].nameID == data.from) {
      origin = location[0];
      destination = location[1];
    } else {
      origin = location[1];
      destination = location[0];
    }

    // Step 4: Fetch available schedules based on common routes and the selected date
    const sql3 = `
      SELECT 
          s.scheduleID AS 'id',
          s.departureTime AS 'startTime',
          CONCAT(b.lat, ', ', b.lng) AS startPoint,
          v.vehicleRegNo AS 'regNo',
          v.serviceType AS 'service',
          r.routeType,
          r.routeNo,  
          v.org,
          s.bookedSeats AS 'booked',
          v.seats,
          s.closingDate AS 'closing'
      FROM 
          ROUTE r
      JOIN 
          SCHEDULE s ON r.routeID = s.routeID
      JOIN 
          VEHICLE v ON s.vehicleID = v.vehicleID
      JOIN
          BUSSTOP_LOCATIONS b ON b.locationID = s.startLocation
      WHERE 
          r.routeNo IN (?) AND s.date = ?;
    `;

    const [results] = await db.query(sql3, [commonRoutes, data.date]);
    console.log("Route Details: ", results);

    const schedules = await Promise.all(
      results.map(async (result) => {
        // Ensure startPoint is formatted as "lat, lng"
        console.log("Start Point:", result.startPoint);
        
        // Logging origin and destination locations
        console.log("Origin Location:", origin.location);
        console.log("Destination Location:", destination.location);
    
        const details = await journeyDetails(
          result.startPoint, // This should already be in the correct format
          origin.location, // Ensure this is in "lat, lng" format
          destination.location, // Ensure this is in "lat, lng" format
          data.date,
          result.startTime
        );
    
        if (details.distance > 0) {
          // Calculating Fare
          const fare = await calculateFare(parseFloat(details.distance));
    
          return {
            ...result,
            from: origin.name,
            to: destination.name,
            departure: details.departureTime,
            arrival: details.arrivalTime,
            journey: details.distance.toFixed(2),
            price: fare,
          };
        } else {
          return null;
        }
      })
    );
    

    // Filter out any null values from the results (in case details.journey wasn't valid)
    const scheduleDetails = schedules.filter(Boolean);

    console.log("Available Buses:", scheduleDetails);
    res.status(200).json(scheduleDetails);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export default Sdl1;
