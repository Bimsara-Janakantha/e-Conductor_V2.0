import { Client } from "@googlemaps/google-maps-services-js";
import env from "dotenv";
import moment from "moment";

env.config();

// Initialize Google Maps client
const client = new Client({});

export const journeyDetails = async (
  startLocation, // Start location coordinates (lat, lng)
  fromLocation, // From bus stop coordinates (lat, lng)
  toLocation, // To bus stop coordinates (lat, lng)
  date, // Date in 'YYYY-MM-DD' format
  time // Time in 'HH:mm' format
) => {
  console.log("\nStart Location: ", startLocation); // Start point coordinates
  console.log("From Location: ", fromLocation); // First bus stop
  console.log("To Location: ", toLocation); // Final destination bus stop
  console.log("Date: ", date); // Date in 'YYYY-MM-DD'
  console.log("Time: ", time); // Time in 'HH:mm'

  try {
    // Create a Moment.js object with the provided date and time
    const departureDate = moment(`${date} ${time}`, "YYYY-MM-DD HH:mm");

    // Convert to UNIX timestamp (seconds since epoch)
    const departureTime = departureDate.unix();

    // 1. Calculate journey from startLocation to fromLocation
    const fromResponse = await client.directions({
      params: {
        origin: startLocation,
        destination: fromLocation,
        mode: "transit",
        transit_mode: "bus",
        departure_time: departureTime, // Use the given date and time
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    let fromLeg;
    if (!fromResponse.data.routes[0] || !fromResponse.data.routes[0].legs[0]) {
      fromLeg = {
        time: departureDate.format("h:mm A"), // Format time as '2:45 PM'
        distance: 0,
      };
    } else {
      fromLeg = {
        time: fromResponse.data.routes[0].legs[0].arrival_time.text,
        distance: fromResponse.data.routes[0].legs[0].distance?.value,
      };
    }

    // 2. Calculate journey from startLocation to toLocation
    const toResponse = await client.directions({
      params: {
        origin: startLocation,
        destination: toLocation,
        mode: "transit",
        transit_mode: "bus",
        departure_time: departureTime, // Use the given date and time
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    let toLeg;
    if (!toResponse.data.routes[0] || !toResponse.data.routes[0].legs[0]) {
      toLeg = {
        time: departureDate.format("h:mm A"),
        distance: 0,
        duration: 0,
      }; // Format time as '2:45 PM'
    } else {
      toLeg = {
        time: toResponse.data.routes[0].legs[0].arrival_time.text,
        distance: toResponse.data.routes[0].legs[0].distance?.value,
        duration: toResponse.data.routes[0].legs[0].duration?.text,
      };
    }

    const distance = 0.001 * (toLeg.distance - fromLeg.distance); // Convert distance from meters to kilometers

    console.log(
      `From: ${fromLeg.distance} To: ${toLeg.distance} Distance: ${distance}`
    );

    // Return all calculated details
    return {
      departureTime: fromLeg.time,
      arrivalTime: toLeg.time,
      distance,
      duration: toLeg.duration,
    };
  } catch (err) {
    // Handle errors
    console.error(err);
    throw new Error(err.message);
  }
};
