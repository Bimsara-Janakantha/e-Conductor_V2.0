import createHttpError from "http-errors";
import { db } from "../db.js";

// mountain => 2 km
// falt => 2.5 km

const MinDistance = 2.0; // in km

export default async function calculateFare(distance) {
  try {
    const [fareDetails] = await db.query(
      `SELECT value FROM GENERAL WHERE item IN ('Ticket_Fee_Min', 'Ticket_Fee_Step');`
    );

    if (fareDetails.length != 2) {
      console.log("Fare data not found!");
      throw createHttpError(404, "Fare data not found!");
    }

    const minFare = parseFloat(fareDetails[0].value);
    const stepVal = parseFloat(fareDetails[1].value);

    let fare;

    if (distance <= MinDistance) {
      fare = minFare.toFixed(2);
    } else {
      fare = (minFare + (distance - MinDistance) * stepVal).toFixed(2);
    }

    return fare;
  } catch (error) {
    console.log("Error in bus fare calculation!");
    createHttpError(500, "Error in bus fare calculation!");
  }
}
