import { db } from "../../db.js";
import createHttpError from "http-errors";

// Requesting available tickets from db
const Tkt4 = async (req, res, next) => {
  const { data } = req.body;

  console.log(`\nTkt4: Available ticket Request:: userId:${data}`);

  try {
    // Query to fetch available tickets for the user
    const sql1 = `SELECT * FROM TICKET WHERE passengerID = ? AND status = 'Available'`;

    const [ticketsResult] = await db.query(sql1, data);

    const user_ticket_data = [];

    // Process each ticket using async/await instead of Promise
    for (const ticket of ticketsResult) {
      const sql2 = `
                    SELECT 
                        SCHEDULE.departureTime,
                        VEHICLE.vehicleRegNo, 
                        VEHICLE.org, 
                        VEHICLE.serviceType, 
                        ROUTE.routeNo, 
                        ROUTE.start, 
                        ROUTE.end, 
                        fromStop.name AS fromLocation, 
                        toStop.name AS toLocation
                    FROM 
                        SCHEDULE 
                    JOIN 
                        VEHICLE ON SCHEDULE.vehicleID = VEHICLE.vehicleID 
                    JOIN 
                        ROUTE ON SCHEDULE.routeID = ROUTE.routeID 
                    JOIN 
                        BUSSTOP_NAMES fromStop ON fromStop.nameID = ? 
                    JOIN 
                        BUSSTOP_NAMES toStop ON toStop.nameID = ?
                    WHERE 
                        SCHEDULE.scheduleID = ?;
                    `;

      const values2 = [
        ticket.fromLocation,
        ticket.toLocation,
        ticket.scheduleID,
      ];

      // Execute second query for schedule details
      const [scheduleResult] = await db.query(sql2, values2);
      //console.log("Schedule details: ", scheduleResult);

      // Enabeling tracking and cancelling
      if (scheduleResult.length > 0) {
        const fiveMins = 300000; // 5 minutes in milliseconds
        const day = 86400000; // 1 day in milliseconds
        const now = new Date();

        const startDateTime = new Date(
          `${ticket.jrnDate} ${scheduleResult[0].departureTime}`
        );
        const endDateTime = new Date(`${ticket.jrnDate} ${ticket.jrnEndTime}`);

        let tracking = false;
        let cancel = false;

        // Allow cancellation if journey is more than a day away
        if (now.getTime() + day < startDateTime.getTime()) {
          cancel = true;
        }

        /* console.log(
          "Now: ",
          now,
          " | Start: ",
          startDateTime,
          " | End: ",
          endDateTime
        ); */

        // Determine tracking status based on the time window
        if (
          now.getTime() + fiveMins > startDateTime.getTime() &&
          now.getTime() - fiveMins < endDateTime.getTime()
        ) {
          tracking = true;
        }

        // Push ticket details into the user_ticket_data array
        user_ticket_data.push({
          refNo: ticket.ticketNo.toString().padStart(6, "0"),
          date: ticket.jrnDate,
          departure: scheduleResult[0].departureTime,
          fromT: ticket.jrnStartTime,
          toT: ticket.jrnEndTime,
          from: scheduleResult[0].fromLocation,
          to: scheduleResult[0].toLocation,
          seats: ticket.seatNos.join(", "),
          full: ticket.full,
          half: ticket.half,
          price: ticket.ticketPrice,
          regNo: scheduleResult[0].vehicleRegNo,
          org: scheduleResult[0].org,
          service: scheduleResult[0].serviceType,
          route: `${scheduleResult[0].routeNo} ${scheduleResult[0].start}-${scheduleResult[0].end}`,
          tracking,
          cancel,
        });
      }
    }

    // Send the response after processing all tickets
    console.log("My tickets: ", user_ticket_data);
    res.status(200).json(user_ticket_data);
  } catch (error) {
    console.log(error);
    next(createHttpError(503, "Database connection is failed!"));
  }
};

export default Tkt4;
