import { db } from "../../db.js";
import createHttpError from "http-errors";

// Requesting ticket history from db
const trans2 = async (req, res, next) => {
  const { data } = req.body;
  console.log("\nTrans2:: Refund Confirmation: ", data);

  let connection;

  try {
    // Step 0: Get a connection and begin a transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    const ticketNo = parseInt(data.refNo);

    // Step 1: Get passenger ID and seatNos from ticket
    const sql1 = `SELECT passengerID, seatNos, scheduleID FROM TICKET WHERE ticketNo = ?`;
    const [result1] = await connection.query(sql1, ticketNo);
    if (result1.length === 0) {
      console.log("Ticket not found!");
      throw createHttpError(404, "Ticket not found");
    }

    const { passengerID, seatNos, scheduleID } = result1[0];
    console.log("Ticket Details", result1[0]);

    // Step 2: Update credits in the user's account
    const sql2 = `UPDATE USERS SET credits = credits + ? WHERE userID = ?`;
    const data2 = [data.refund, passengerID];
    const [result2] = await connection.query(sql2, data2);

    if (result2.changedRows == 0) {
      console.log("User not found!");
      throw createHttpError(404, "User not found");
    }

    console.log("Credits updated successfully!");

    // Step 3: Update ticket status to "Refunded"
    const sql3 = `UPDATE TICKET SET status = 'Refunded' WHERE ticketNo = ?`;
    await connection.query(sql3, ticketNo);

    console.log("Ticket Updated!");

    // Step 4: Insert a new transaction record
    const sql4 = `INSERT INTO TRANSACTION (userID, amount, date, time, refNo, type) VALUES (?)`;
    const data4 = [
      passengerID,
      data.refund,
      data.cancelDate,
      data.cancelTime,
      data.refNo,
      "Refund",
    ];
    await connection.query(sql4, [data4]);

    console.log("Transaction Added!");

    // Step 5: Get booked seats from schedule
    const sql5 = `
        SELECT 
            s.bookedSeats,
            s.vehicleID,
            s.date,
            s.status,
            s.linkedBus,
            a.ownerID AS actualOwner,
            l.ownerID AS linkedOwner
        FROM 
            SCHEDULE s
        JOIN
            VEHICLE a ON a.vehicleID = s.vehicleID
        LEFT JOIN
            VEHICLE l ON l.vehicleID = s.linkedBus
        WHERE 
            s.scheduleID = ?
    `;
    const [result5] = await connection.query(sql5, [scheduleID]);
    if (result5.length == 0 || !result5[0].bookedSeats) {
      console.log("Schedule not found!");
      throw createHttpError(404, "Schedule not found");
    }
    console.log("Schedule Data: ", result5[0]);
    console.log("Booked Seats :", result5[0].bookedSeats);
    console.log("Removed Seats:", seatNos);

    // Remove the seats in seatNosToRemove from bookedSeats
    const updatedSeats = result5[0].bookedSeats.filter(
      (seat) => !seatNos.includes(seat)
    );

    console.log("Updated Seats: ", updatedSeats);

    // Step 6: Update schedule
    const sql6 = `UPDATE SCHEDULE SET bookedSeats = ? WHERE scheduleID = ?`;
    await connection.query(sql6, [JSON.stringify(updatedSeats), scheduleID]);

    // Step 7: Update owner credits
    let vehicle, owner;
    if (result5[0].status === "replace") {
      vehicle = result5[0].linkedBus;
      owner = result5[0].linkedOwner;
    } else {
      vehicle = result5[0].vehicleID;
      owner = result5[0].actualOwner;
    }

    const sql7 = `
        UPDATE ACTIVITY a
        JOIN USERS u ON u.userID = ?
        SET 
            a.refund = a.refund + 1,
            a.refundMoney = a.refundMoney + ?,
            u.credits = u.credits - ?
        WHERE
            a.vehicleID = ? AND a.date = ?
    `;

    const data7 = [owner, data.refund, data.refund, vehicle, result5[0].date];

    await connection.query(sql7, data7);

    console.log("Owner Account Updated!");

    // Step 8: Add new transaction
    const data8 = [
      owner,
      data.refund,
      data.cancelDate,
      data.cancelTime,
      data.refNo,
      "Debit",
    ];

    await connection.query(sql4, [data8]);

    console.log("New Transaction Added!");

    // Step 7: Commit the transaction
    await connection.commit();
    console.log("Refund Completed!");
    res.status(200).send("success");
  } catch (error) {
    if (connection) {
      await connection.rollback(); // Roll back any changes if error occurs
    }
    next(error); // Pass the error to the Express error handl
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

export default trans2;
