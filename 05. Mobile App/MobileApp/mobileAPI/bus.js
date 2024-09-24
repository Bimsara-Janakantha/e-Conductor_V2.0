import express from "express";
import { db } from "../db.js";
import { journeyDetails } from "../journey_details.js";

const router = express.Router();

// Schedule handling
router.post("/info", async (req, res) => {
  const { type, data } = req.body;
  console.log(`New Request:: type: ${type} Data: ${JSON.stringify(data)}`);

  if (type === "reqInfo") {
    // Query to get bus stop locations and names
    const busStopQuery = `
      SELECT 
        BUSSTOP_LOCATIONS.lat, 
        BUSSTOP_LOCATIONS.lng, 
        BUSSTOP_LOCATIONS.routes, 
        BUSSTOP_NAMES.name
      FROM 
        BUSSTOP_LOCATIONS
      JOIN 
        BUSSTOP_NAMES ON BUSSTOP_LOCATIONS.nameID = BUSSTOP_NAMES.nameID
      WHERE 
        BUSSTOP_LOCATIONS.nameID IN (?, ?);
    `;
    const busStopValues = [data.from, data.to];

    db.query(busStopQuery, busStopValues, async (err, busStopResults) => {
      if (err) {
        console.error("Error querying bus stop locations:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      if (busStopResults.length > 1) {
        const busStops = [
          ...new Map(busStopResults.map((busStop) => [busStop.name, busStop])).values(),
        ];

        const origin = [`${busStops[0].lat}, ${busStops[0].lng}`];
        const destination = [`${busStops[1].lat}, ${busStops[1].lng}`];
        const commonRoutes = busStops[0].routes.filter((route) =>
          busStops[1].routes.includes(route)
        );

        if (commonRoutes.length > 0) {
          try {
            const journeyDetailsResult = await journeyDetails(origin, destination);

            // Query to get schedule details
            const scheduleQuery = `
              SELECT 
                s.scheduleID AS id,
                v.vehicleRegNo AS regNo,
                v.serviceType AS service,
                r.routeType,
                r.routeNo,  
                v.org,
                s.bookedSeats AS booked,
                v.seats,
                s.closingDate AS closing
              FROM 
                ROUTE r
              JOIN 
                SCHEDULE s ON r.routeID = s.routeID
              JOIN 
                VEHICLE v ON s.vehicleID = v.vehicleID
              WHERE 
                r.routeNo IN (?);
            `;

            db.query(scheduleQuery, [commonRoutes], (err, scheduleResults) => {
              if (err) {
                console.error("Error querying schedule details:", err);
                return res.status(500).json({ error: "Database query error" });
              }

              let scheduleDetails = scheduleResults.map((result) => ({
                ...result,
                ...journeyDetailsResult,
                from: busStops[0].name,
                to: busStops[1].name,
                price: 30.0,
              }));

              scheduleDetails = scheduleDetails.map((detail, index) => ({
                ...detail,
                id: (index + 1).toString(),
              }));

              res.json(scheduleDetails);
            });
          } catch (error) {
            console.error("Error fetching journey details:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        } else {
          res.json([]);
        }
      } else {
        res.status(400).json({ error: "Invalid bus stop data" });
      }
    });
  } else {
    res.status(400).json({ error: "Invalid request type" });
  }
});

// Getting bus stop names
router.get("/busstops", async (req, res) => {
  console.log(`requesting busstop names`);

  const sql = "SELECT nameID AS id, name, JSON_OBJECT('lat', lat, 'lng', lng) AS location FROM BUSSTOP_NAMES";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).send('Server error');
    } else {
      res.json(result);
    }
  });
});

router.get("/reqestBusLoc", (req, res) => {
  const sql = `SELECT lat, lng FROM BUS_LOCATIONS WHERE regNo = ?;`;
  const values = [req.query.regNo];

  console.log(`Received request for bus location with regNo: ${req.query.regNo}`);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(`Error executing query: ${err.message}`);
      res.status(500).send("Error fetching destination location");
    } else {
      if (result.length > 0) {
        console.log(`Found location: ${JSON.stringify(result[0])}`);
        res.json(result[0]);
      } else {
        console.error('Destination not found');
        res.status(404).send("Destination not found");
      }
    }
  });
});

router.post("/updateBusLoc", (req, res) => {
  const { regNo, lat, lng, speed } = req.body;

  if (!regNo || lat === undefined || lng === undefined || speed === undefined) {
    return res.status(400).send("Missing registration number, coordinates, or speed");
  }

  const sql = `UPDATE BUS_LOCATIONS SET lat = ?, lng = ?, speed = ? WHERE regNo = ?;`;
  const values = [lat, lng, speed, regNo];

  console.log(`Received update for bus location with regNo: ${regNo}, lat: ${lat}, lng: ${lng}, speed: ${speed}`);

  db.query(sql, values, (err) => {
    if (err) {
      console.error(`Error executing update query: ${err.message}`);
      res.status(500).send("Error updating bus location");
    } else {
      console.log(`Location updated successfully for regNo: ${regNo}`);
      res.send("Bus location updated successfully");
    }
  });
});



export default router;
