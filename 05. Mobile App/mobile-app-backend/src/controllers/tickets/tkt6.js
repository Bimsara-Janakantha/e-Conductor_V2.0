// Tracking General Details

import createHttpError from "http-errors";
import { db } from "../../db.js";
import connectingPoints from "../../utils/connectingpoints.js";

const Tkt6 = async (req, res, next) => {
  const { ticketNo, userID } = req.query.data;
  console.log("Tkt6: Tracking request data: ", { ticketNo, userID });

  try {
    const sql = ` SELECT 
                      TICKET.jrnDate,
                      TICKET.jrnEndTime,
                      SCHEDULE.departureTime,
                      VEHICLE.vehicleRegNo, 
                      VEHICLE.org, 
                      VEHICLE.serviceType, 
                      ROUTE.routeNo, 
                      ROUTE.routeType,
                      ROUTE.start AS startPoint, 
                      ROUTE.end AS endPoint, 
                      JSON_OBJECT('name', fromStop.name, 'location', JSON_OBJECT('lat', fromStop.lat, 'lng', fromStop.lng)) AS 'from', 
                      JSON_OBJECT('name', toStop.name, 'location', JSON_OBJECT('lat', toStop.lat, 'lng', toStop.lng)) AS 'to',
                      JSON_OBJECT('name', startStop.name, 'location', JSON_OBJECT('lat', startStop.lat, 'lng', startStop.lng)) AS 'start'
                  FROM 
                      TICKET 
                  JOIN
                      SCHEDULE ON TICKET.scheduleID = SCHEDULE.scheduleID
                  JOIN 
                      VEHICLE ON SCHEDULE.vehicleID = VEHICLE.vehicleID 
                  JOIN 
                      ROUTE ON SCHEDULE.routeID = ROUTE.routeID 
                  JOIN 
                      BUSSTOP_NAMES fromStop ON TICKET.fromLocation = fromStop.nameID 
                  JOIN 
                      BUSSTOP_NAMES toStop ON TICKET.toLocation = toStop.nameID
                  JOIN
                      BUSSTOP_NAMES startStop ON SCHEDULE.startLocation = startStop.nameID
                  WHERE 
                      TICKET.ticketNo = ? AND TICKET.passengerID = ?;
                `;

    const [result] = await db.query(sql, [parseInt(ticketNo), userID]);

    if (result.length != 1) {
      console.log("Ticket Not Available!");
      throw createHttpError(404, "Ticket Not Available!");
    }

    console.log("Ticket is available!: ", result[0]);

    // Checking availablity of tracking
    const fiveMins = 300000; // 5 minutes in milliseconds
    const now = new Date();

    const startDateTime = new Date(
      `${result[0].jrnDate} ${result[0].departureTime}`
    );
    const endDateTime = new Date(
      `${result[0].jrnDate} ${result[0].jrnEndTime}`
    );

    // Tracking availability
    const availability =
      now.getTime() + fiveMins > startDateTime.getTime() &&
      now.getTime() - fiveMins < endDateTime.getTime();

    // Bus general infomation
    const busInfo = {
      refNo: ticketNo,
      regNo: result[0].vehicleRegNo,
      route: `${result[0].routeNo} ${result[0].startPoint}-${result[0].endPoint}`,
      org: result[0].org,
      service: result[0].serviceType,
      routeType: result[0].routeType,
      startT: result[0].departureTime,
      from: result[0].from,
      to: result[0].to,
      start: result[0].start,
    };

    // Make an algorithm to find the connecting points
    //console.log("\nFrom: ", result[0].from);
    //console.log("To: ", result[0].to);

    const routePoints = await connectingPoints(
      result[0].start.location,
      result[0].to.location
    );

    const sendData = { availability, busInfo, routePoints };

    console.log("Send Data: ", sendData);
    res.status(200).json(sendData);
  } catch (error) {
    console.error("Error processing refund:", error);
    next(error);
  }
};

export default Tkt6;
