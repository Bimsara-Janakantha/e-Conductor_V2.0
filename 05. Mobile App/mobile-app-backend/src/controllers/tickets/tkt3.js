import { db } from "../../db.js";
import createHttpError from "http-errors";

const tkt3 = async (req, res, next) => {
  const { data } = req.body;
  console.log("\nTkt3:: Ticket details: ", data);
  const totalCost = parseFloat(data.totalPrice);
  const seatNumbers = data.seatNos;

  let connection;

  try {
    // Step 0: Get a connection and begin a transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Step 1: Get user's current credits and validate
    const [userResult] = await connection.query(
      `SELECT credits FROM USERS WHERE userID = ?`,
      [data.userID]
    );
    console.log("userResults: ", userResult);
    if (userResult.length === 0) {
      console.log("User not found!");
      throw createHttpError(404, "User not found");
    }

    const userCredits = parseFloat(userResult[0].credits);
    if (userCredits < totalCost) {
      console.log("Insufficient credits for this booking");
      return res.status(200).send("insufficient");
    }

    // Step 2: Get already booked seats from the SCHEDULE table and validate
    const [scheduleResult] = await connection.query(
      `SELECT bookedSeats FROM SCHEDULE WHERE scheduleID = ?`,
      [data.scheduleId]
    );
    console.log("ScheduleResults: ", scheduleResult);
    if (scheduleResult.length === 0) {
      console.log("Schedule not found");
      throw createHttpError(404, "Schedule not found");
    }

    const alreadyBookedSeats = scheduleResult[0].bookedSeats;
    seatNumbers.forEach((seat) => {
      if (alreadyBookedSeats.includes(seat)) {
        throw createHttpError(400, "Seats already booked");
      }
    });

    // Step 3: Update user's credits
    const updateUserCredits = `UPDATE USERS SET credits = credits - ? WHERE userID = ?`;
    await connection.query(updateUserCredits, [totalCost, data.userID]);
    console.log("Credits updated!");

    // Step 4: Update the booked seats in the SCHEDULE table
    const updatedBookedSeats = [...alreadyBookedSeats, ...seatNumbers];
    const updateSchedule = `UPDATE SCHEDULE SET bookedSeats = ? WHERE scheduleID = ?`;
    await connection.query(updateSchedule, [
      JSON.stringify(updatedBookedSeats),
      data.scheduleId,
    ]);
    console.log("Seats updated!");

    // Step 5: Add a new entry to the TRANSACTION table
    const insertTransaction = `INSERT INTO TRANSACTION (userID, amount, date, time, type) VALUES (?, ?, ?, ? ,?)`;
    const [transaction] = await connection.query(insertTransaction, [
      data.userID,
      totalCost,
      data.issuedDate,
      data.issuedTime,
      "Payment",
    ]);
    console.log("Transaction table updated! id:", transaction);

    // Step 6: Add a new TICKET to the TICKET table
    const insertTicket = `INSERT INTO TICKET (passengerID, issuedDate, issuedTime, jrnDate, jrnStartTime, jrnEndTime, fromLocation, toLocation, distance, half, full, unitPrice, ticketPrice, seatNos, status, scheduleID, transID, discount ) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    await connection.query(insertTicket, [
      data.userID,
      data.issuedDate,
      data.issuedTime,
      data.date,
      data.aproxDepT,
      data.aproxAriT,
      data.from,
      data.to,
      data.journey,
      data.half,
      data.full,
      data.unitPrice,
      data.totalPrice,
      JSON.stringify(data.seatNos),
      "Available",
      data.scheduleId,
      transaction.insertId,
      data.discount,
    ]);

    // Step 8: Commit the transaction
    await connection.commit();
    res.status(200).send("success");
  } catch (err) {
    if (connection) {
      await connection.rollback(); // Roll back any changes if error occurs
    }
    next(err); // Pass the error to the Express error handler
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

export default tkt3;
