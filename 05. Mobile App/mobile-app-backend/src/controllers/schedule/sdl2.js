import createHttpError from "http-errors";
import { db } from "../../db.js";

// Returns booked bus seats and other details for bus operator
const Sdl2 = async (req, res, next) => {
  const { id, date } = req.body;

  if (!id || !date) {
    return next(createHttpError(400, "Invalid input. ID and date are required."));
  }

  console.log(`\nFinding vehicle details for ID: ${id} on ${date}`);

  try {
    const sql = `
      SELECT V.vehicleRegNo, V.seats, S.date, S.departureTime, S.bookedSeats
      FROM SCHEDULE S
      JOIN VEHICLE V ON S.vehicleID = V.vehicleID
      WHERE (S.driverID = ? OR S.conductorID = ?) AND S.date = ?;
    `;

    const [result] = await db.query(sql, [id, id, date]);

    console.log(`Vehicle details found successfully!\nDetails: ${JSON.stringify(result)}`);

    if (result.length > 0) {
      res.status(200).json(result);
    } else {
      console.log("No vehicle details found.");
      res.status(204).send("No vehicle details found for the given ID and date.");
    }
  } catch (error) {
    next(createHttpError(503, "Database connection failed!"));
    console.error(error.message);
  }
};

export default Sdl2;
