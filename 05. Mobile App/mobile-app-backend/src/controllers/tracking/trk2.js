import createHttpError from "http-errors";
import { db } from "../../db.js";

// Inserting or updating bus location
const Trk2 = async (req, res, next) => {
  const { regNo, lat, lng, speed } = req.body;
  console.log(`Updating location for Bus: ${regNo}`);

  try {
    const sql = `
      INSERT INTO BUS_LOCATIONS (regNo, lat, lng, speed) 
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        lat = VALUES(lat),
        lng = VALUES(lng),
        speed = VALUES(speed);
    `;

    const [result] = await db.query(sql, [regNo, lat, lng, speed]);

    if (result.affectedRows > 0) {
      console.log("Bus location updated successfully!");
      res.status(200).json({ message: "Bus location updated successfully!" });
    } else {
      console.log("Failed to update bus location.");
      throw createHttpError(503, "Failed to update bus location.");
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default Trk2;
