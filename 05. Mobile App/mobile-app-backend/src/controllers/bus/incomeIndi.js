import createHttpError from "http-errors";
import { db } from "../../db.js";

// Income retrieval function
const IncomeIndividual = async (req, res, next) => {
  const { id } = req.body; // Use req.body for POST parameters
  console.log(`Requesting bus income for Owner ID: ${id}`);

  try {
    // Step 1: Fetch the vehicle numbers associated with the owner ID
    console.log("Fetching vehicles from the database...");
    const vehicles = await db.query(
      `
  SELECT V.vehicleRegNo 
  FROM VEHICLE V
  WHERE V.ownerID = ?
`,
      [id]
    );

    // Log the fetched vehicles
    console.log("Fetched vehicles:", vehicles);

    // Check if any vehicles are found
    if (!vehicles || vehicles.length === 0 || vehicles[0].length === 0) {
      console.log("No vehicles found for this owner ID.");
      return res.json([]); // Return an empty array
    }

    // Extract vehicle registration numbers from the first element of the vehicles array
    const vehicleNumbers = vehicles[0].map((vehicle) => vehicle.vehicleRegNo);

    // Log the vehicle numbers
    console.log("Vehicle numbers associated with owner ID:", vehicleNumbers);

    // Step 2: Generate weekly earnings data for each bus
    const earningsData = vehicleNumbers.map((vehicleRegNo) => {
      // Dummy data for each vehicle
      const receivedData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
      const refundData = [400, 398, 900, 308, 800, 300, 400];
      const earningData = receivedData.map((element, idx) => {
        return receivedData[idx] - refundData[idx];
      });
      const xLabels = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      console.log(`Generated earnings data for vehicle ${vehicleRegNo}:`, {
        receivedData,
        refundData,
        earningData,
      });

      return {
        vehicleRegNo,
        weekly: { receivedData, refundData, earningData, xLabels },
      };
    });

    // Log the final earnings data
    console.log("Final earnings data to be sent in response:", earningsData);
    res.json(earningsData);
  } catch (err) {
    console.error("Error occurred while fetching income data:", err.message);
    next(createHttpError(503, "Failed to retrieve bus income data!"));
  }
};

export default IncomeIndividual;
