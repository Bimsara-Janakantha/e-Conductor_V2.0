import createHttpError from "http-errors";
import { db } from "../../db.js";

const Report = async (req, res, next) => {
  const { userID, refNo, type, report } = req.body;
  console.log(`Updating reports of the bus that ticket: ${userID} belong to`);

  try {
    // const sql = `
    //   INSERT INTO BUS_LOCATIONS (userID, refNo, type, report) 
    //   VALUES (?, ?, ?, ?)
    //   ON DUPLICATE KEY UPDATE
    //     refNo = VALUES(refNo),
    //     type = VALUES(type),
    //     report = VALUES(report);
    // `;

    // const [result] = await db.query(sql, [userID, refNo, type, report]);

    // if (result.affectedRows > 0) {
    //   console.log("Bus location updated successfully!");
    //   res.status(200).json({ message: "Bus location updated successfully!" });
    // } else {
    //   console.log("Failed to update bus location.");
    //   throw createHttpError(503, "Failed to update bus location.");
    // }

    console.log("Report received!");
    res.status(200).json({ message: "Report received!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default Report;
