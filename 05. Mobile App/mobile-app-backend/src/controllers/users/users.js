import createHttpError from "http-errors";
import { db } from "../../db.js";

export const callUsers = (req, res, next) => {
  const { type, data } = req.body;
  console.log("\n\nUsers Request:: type: ", type);

  // Here you might want to find userID, email userType, empType from DB and send back to the frontend (request comming from login page)
  if (type === "Req1") {
    console.log(`Finding primary data of user, Mobile Number: ${data}`);

    const sql = `SELECT userID, userType, empType, email 
               FROM USERS
               WHERE mobile = ? AND userState != 'banned' `;

    db.query(sql, data, (err, result) => {
      if (err) {
        next(createHttpError(503, "Database connection is failed!"));
        console.log(err.message);
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
        );
        if (result.length > 0) {
          const userData = result[0];
          console.log(
            `User is available. ID: ${userData.userID}  email: ${userData.email}`
          );
          res.status(200).json(userData);
        } else {
          console.log("No user.");
          res.status(204).send("invalid");
        }
      }
    });
  }

  // Here you might want to find user availability from DB and send back to the frontend (request comming from signup page)
  else if (type === "Req2") {
    console.log(
      `New user availability checking. Mobile Number: ${data.mobile}   Email: ${data.email}`
    );

    const sql = `SELECT userID FROM USERS WHERE email = ? OR mobile = ?`;
    const values = [data.email, data.mobile];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err.message);
        next(createHttpError(503, "Database connection is failed!"));
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
        );
        if (result.length > 0) {
          console.log("User is currently used");
          res.status(226).send("false");
        } else {
          console.log("User is available to use");
          res.status(200).send("true");
        }
      }
    });
  }

  // Save registed data into db
  else if (type === "Req3") {
    console.log("Registering new user!", data);

    let sql = "";
    let values = [];

    // Defining queries
    switch (data.userType) {
      case "passenger": {
        // Query for passenger
        sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, credits, userState)
           VALUES (?)`;
        values = [
          data.userType,
          data.empType,
          data.fName,
          data.lName,
          data.email,
          data.mobile,
          0,
          "active",
        ];
        break;
      }
      case "employee": {
        // Query for employee
        sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, credits, userState)
           VALUES (?)`;
        values = [
          data.userType,
          data.empType,
          data.fName,
          data.lName,
          data.email,
          data.mobile,
          data.nic,
          data.birthDay,
          data.ntc,
          data.licence,
          0,
          "active",
        ];
        break;
      }
      case "owner": {
        if (data.empType !== "None") {
          // Query for owner does not work as an employee
          sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, accName, accNo, bank, branch, credits, userState)
             VALUES (?)`;
          values = [
            data.userType,
            data.empType,
            data.fName,
            data.lName,
            data.email,
            data.mobile,
            data.nic,
            data.birthDay,
            data.ntc,
            data.licence,
            data.accName,
            data.accNo,
            data.bank,
            data.branch,
            0,
            "active",
          ];
        } else {
          // Query for owner work as an employee
          sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, accName, accNo, bank, branch, credits, userState)
             VALUES (?)`;
          values = [
            data.userType,
            data.empType,
            data.fName,
            data.lName,
            data.email,
            data.mobile,
            data.nic,
            data.birthDay,
            data.accName,
            data.accNo,
            data.bank,
            data.branch,
            0,
            "active",
          ];
        }
        break;
      }
      default:
        break;
    }

    // DB connection
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err.message + "\n");
        next(createHttpError(503, "Database connection is failed!"));
      } else {
        console.log("Entry added successfully!\n\n");
        res.status(201).json("success");
      }
    });
  }

  // Get data for the general page
  else if (type === "Req4") {
    console.log(`General Page Request :: UserID: ${data}`);

    // Query the database for user data
    const query = ` SELECT 
              CONCAT(u.fName, ' ', u.lName) AS name,
              u.UserType,
              u.mobile,
              u.email,
              u.credits,
              COUNT(CASE WHEN t.status = 'Available' THEN t.ticketNo END) AS tickets,
              COUNT(CASE WHEN t.status = 'Used' THEN t.ticketNo END) AS rides
            FROM USERS u
            LEFT JOIN TICKET t ON t.passengerID = u.userID
            WHERE u.UserID = ?
            GROUP BY u.fName, u.lName, u.UserType, u.mobile, u.email, u.credits
          `;

    db.query(query, [data], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        next(createHttpError(503, "Database connection is failed!"));
      }

      if (results.length > 0) {
        const userData = results[0];
        console.log(`Server Replies to ${data} as ${JSON.stringify(userData)}`);
        res.status(200).json(userData);
      } else {
        console.log(`No user found with ID: ${data}`);
        next(createHttpError(404, "User not found!"));
      }
    });
  }

  // Get all personal details of the user
  else if (type === "Req5") {
    console.log(
      `Settings Page Request:: User ${data} is requested his infomation.`
    );

    const sql = `
            SELECT userID, userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, accName, accNo, bank, branch
            FROM USERS
            WHERE userID = ?;
            `;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        next(createHttpError(503, "Database connection is failed!"));
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result[0])}`
        );
        if (result.length > 0) {
          res.status(200).json(result[0]);
        } else {
          next(createHttpError(404, "Data not found"));
        }
      }
    });
  }

  // Check availability of new data
  else if (type === "Req6") {
    console.log(
      "Checking availability of the user's new data.::\n",
      JSON.stringify(data)
    );

    const sql = `SELECT userID FROM USERS WHERE userID != ? AND (email = ? OR mobile = ? OR nic = ?)`;

    db.query(
      sql,
      [data.userID, data.email, data.mobile, data.nic],
      (err, result) => {
        if (err) {
          console.log(err.message + "\n\n");
          next(createHttpError(503, "Database connection1 is failed!"));
        } else {
          console.log(
            `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
          );
          if (result.length > 0) {
            console.log("User currently in use! Cannot procceed request!");
            res.status(226).send("invalid");
          } else {
            console.log("Details are available to use!");

            const sql2 = `SELECT email, mobile, nic FROM USERS WHERE userID = ?`;
            db.query(sql2, [data.userID], (err2, result2) => {
              if (err2) {
                console.log(err2.message + "\n\n");
                next(createHttpError(503, "Database connection2 is failed!"));
              } else {
                const { email, mobile } = result2[0]; // userID is unique
                console.log(
                  `Current contact details:: email:${email}  mobile: ${mobile}`
                );

                // Email or mobile both are changed
                if (email !== data.email && data.mobile !== mobile) {
                  console.log("Email or mobile both are changed");
                  res.status(200).send("emailMobile");
                }

                // Email changed
                else if (email !== data.email) {
                  console.log("Email has changed");
                  res.status(200).send("email");
                }

                // Mobile changed
                else if (mobile !== data.mobile) {
                  console.log("Mobile has changed");
                  res.status(200).send("mobile");
                }

                // Both are remaining unchanged
                else {
                  console.log("unchanged");
                  res.status(200).send("noChange");
                }
              }
            });
          }
        }
      }
    );
  }

  // Update db with userData, after verification in settings page
  else if (type === "Req7") {
    console.log("Updating excisting user:", data);
    const sql = `UPDATE USERS SET userType=?, empType=?, fName=?, lName=?, email=?, mobile=?, nic=?, birthDay=?, ntc=?, licence=?, accName=?, accNo=?, 
                    bank=?, branch=? WHERE userID=?`;

    const updateData = [
      data.userType,
      data.empType,
      data.fName,
      data.lName,
      data.email,
      data.mobile,
      data.nic,
      data.birthDay,
      data.ntc,
      data.licence,
      data.accName,
      data.accNo,
      data.bank,
      data.branch,
      data.userID,
    ];

    db.query(sql, updateData, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        next(createHttpError(503, "Database connection is failed!"));
      } else {
        console.log("ServerResponse: success");
        res.status(200).json("success");
      }
    });
  }

  // Request personal infomation from booking page
  else if (type === "Req8") {
    console.log(`Booking page user data request:: userID: ${data}`);

    const sql = `SELECT CONCAT(fName, ' ', lName) AS name, mobile, email 
                  FROM USERS 
                  WHERE UserID = ? AND userState != 'banned' ;
                `;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err.message);
        next(createHttpError(503, "Database connection is failed!"));
      } else {
        if (result.length > 0) {
          console.log("User Data:", result[0]);
          res.status(200).json(result[0]);
        } else {
          next(createHttpError(404, "User not found!"));
        }
      }
    });
  }

  // Other requests
  else {
    console.log(`Invalid request type: ${type}`);
    next(createHttpError(400, "Invalid request type"));
  }
};
