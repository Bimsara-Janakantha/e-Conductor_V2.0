import createHttpError from "http-errors";
import { db } from "../../db.js";
import { adjustDate } from "../bus/income.js";

function generateDatesBetween(minDate, maxDate) {
  const dates = [];
  let currentDate = new Date(minDate);

  // Ensure the maxDate is a valid date object
  const endDate = new Date(maxDate);

  // Loop until we reach the maxDate
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate).toISOString().split("T")[0]);

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export const Summary = async (req, res, next) => {
  const { data } = req.query;
  console.log("\nRequesting bus summary:", data);

  // Destructuring Object
  const ownerID = data.userID;
  const DATE = parseInt(data.DATE);
  const MONTH = parseInt(data.MONTH);
  const YEAR = parseInt(data.YEAR);
  const type = data.type;

  // Outputs
  const summaryData = [];
  //xLabels = [];

  try {
    let sql, values, dateRange;

    // Annual Summary
    if (type === "year") {
    }

    // Monthly and weekly summary
    else {
      const currentDate = `${YEAR}-${MONTH}-${DATE}`;
      const minDate = adjustDate(YEAR, MONTH, DATE, type);

      dateRange = generateDatesBetween(minDate, currentDate);

      console.log("Dates: ", dateRange);

      sql = `
          SELECT 
              v.vehicleRegNo AS label,
              a.date,
              IFNULL((CASE 
                  WHEN a.date >= ? AND a.date <= ? 
                  THEN a.receivedMoney - a.refundMoney 
                  ELSE 0 
              END), 0) AS earnings
          FROM
              ACTIVITY a
          JOIN 
              VEHICLE v ON v.vehicleID = a.vehicleID
          WHERE
              a.ownerID = ?;
      `;

      values = [minDate, currentDate, data.userID];
    }

    const [results] = await db.query(sql, values);
    console.log("results: ", results);

    // Group data by vehicle and organize earnings per day
    const earningsByVehicle = {};

    // Populate the earnings by vehicle and date
    results.forEach((row) => {
      if (!earningsByVehicle[row.label]) {
        // Initialize each vehicle entry with an empty array
        earningsByVehicle[row.label] = { label: row.label, data: {} };
      }
      // Store earnings by date
      earningsByVehicle[row.label].data[row.date] = row.earnings;
    });

    console.log("Earnings by vehicle: ", earningsByVehicle);

    // Convert to the required format with all dates filled (even missing ones)
    const transformedResult = Object.keys(earningsByVehicle).map((label) => {
      const vehicleData = earningsByVehicle[label];

      // Ensure all dates in the range are represented in the data array
      const data = dateRange.map((date) => vehicleData.data[date] || 0);

      return { label, data };
    });

    console.log("transformedResult: ", transformedResult);

    const xLabels = dateRange.map((date) => {
      const dateObj = new Date(date);
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });

    console.log("xLabels: ", xLabels);
    res.json({ points: transformedResult, xLabels });
  } catch (error) {
    console.log(error.message + "\n");
    next(createHttpError(503, "Database connection is failed!"));
  }
};
