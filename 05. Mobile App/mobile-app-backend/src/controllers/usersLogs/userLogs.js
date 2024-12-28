/* User Logs endpoint */

import createHttpError from "http-errors";
import { db } from "../../db.js";

export const addLogs = async (req, res, next) => {
  const { data } = req.body;

  console.log(`\nAdding User Log::  Successful login!  userId:`, data);

  const connection = await db.getConnection();

  try {
    // Step 0: Begin a transaction
    await connection.beginTransaction();

    // Step 1: Update the USERS table
    const sqlQuery = `
          UPDATE USERS
          SET userState = 'active'
          WHERE userState = 'deactive' AND userID = ?;
        `;

    const [updateResult] = await connection.query(sqlQuery, [data.userID]);

    console.log("Account is activated");

    // Step 2: Insert or update the USER_LOGS table
    const sql = `
          INSERT INTO USER_LOGS (
              userID, device, OS, browser, MAC, IP, date, time, country
            )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
              IP = VALUES(IP),
              date = VALUES(date),
              time = VALUES(time),
              country = VALUES(country)
        `;
    const values = [
      data.userID,
      data.sessionData.device,
      data.sessionData.OS,
      data.sessionData.browser,
      data.sessionData.MAC,
      data.sessionData.IP,
      data.sessionData.date,
      data.sessionData.time,
      data.sessionData.country,
    ];

    await connection.query(sql, values);
    console.log("Entry added or updated to usersLog successfully!");

    // Step 3: Commit the transaction
    await connection.commit();
    res.status(202).json("success");
  } catch (error) {
    console.error(error);

    // Rollback the transaction in case of error
    if (connection) {
      await connection.rollback();
    }

    next(error);
  } finally {
    // Release the connection back to the pool
    if (connection) {
      connection.release();
    }
  }
};

export const deleteLog = async (req, res, next) => {
  const data = req.body;
  console.log(
    `\nSession Terminating:: Terminate user ${data.userID} on ${data.MAC}/${data.browser}`
  );

  try {
    const sql = `DELETE FROM USER_LOGS 
             WHERE userID = ? AND MAC = ? AND browser = ?`;

    const values = [data.userID, data.MAC, data.browser];

    await db.query(sql, values);
    console.log("Entry deleted successfully!\n");
    res.status(201).json("success");
  } catch (error) {
    console.log(err.message + "\n");
    next(createHttpError(503, "Database connection is failed!"));
  }
};

export const updateLogs = async (req, res, next) => {
  const data = req.body;

  console.log(
    `\nChecking availabilty of user session:: Searching about ${data.userID} on ${data.session.MAC}/${data.session.browser}`
  );

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const checkSessionSql = `
          SELECT COUNT(*) AS count FROM USER_LOGS 
          WHERE userID = ? AND MAC = ? AND browser = ?;
      `;

    const updateSessionSql = `
          UPDATE USER_LOGS 
          SET IP = ?, date = ?, time = ?, country = ?
          WHERE userID = ? AND MAC = ? AND browser = ?;
      `;

    const values = [data.userID, data.session.MAC, data.session.browser];

    const updateValues = [
      data.session.IP,
      data.session.date,
      data.session.time,
      data.session.country,
      data.userID,
      data.session.MAC,
      data.session.browser,
    ];

    // Check if the session exists
    const [sessionResult] = await connection.query(checkSessionSql, values);

    const sessionCount = sessionResult[0].count;

    // Session exists, update the row
    if (sessionCount > 0) {
      await connection.query(updateSessionSql, updateValues);

      console.log(
        `Server replies as userID: ${data.userID} with status: active\n`
      );
      res.status(202).json("active");
    }

    // Session does not exist
    else {
      console.log(
        `Server replies as userID: ${data.userID} with status: deactive\n`
      );
      res.status(202).json("deactive");
    }

    // Commit the transaction
    await connection.commit();
  } catch (error) {
    console.error(error.message);

    if (connection) {
      await connection.rollback(); // Roll back any changes if error occurs
    }

    next(createHttpError(503, "Failed to update session log!"));
  } finally {
    if (connection) {
      connection.release(); // Release the connection back to the pool
    }
  }
};

export const getLogs = async (req, res, next) => {
  const { data } = req.query;
  console.log("\nRequesting Device Data:: userID: ", data);

  try {
    const sql = `
      SELECT logID, device, MAC, OS, browser, country, date, time 
      FROM USER_LOGS 
      WHERE userID = ?;
    `;

    const [result] = await db.query(sql, data);

    console.log("Entry searched successfully!\ndevices: ", result);
    res.status(201).json(result);
  } catch (err) {
    console.log(err.message + "\n");
    next(createHttpError(503, "Database connection is failed!"));
  }
};
