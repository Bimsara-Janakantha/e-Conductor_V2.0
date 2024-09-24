import entry from "./mobileAPI/entry.js";
import user from "./mobileAPI/user.js";
import bus from "./mobileAPI/bus.js";

// Import mac module
import macaddress from "macaddress";

//import otp functions
import { generateOTP, sendOTP } from "./otp.js";

//Arrival and Departure times and distances
import { journeyDetails } from "./journey_details.js";

// Express connection
import express from "express";
export const app = express();

// DB connection
//const db = require('./localdb');   // Local db
import { db } from "./db.js";

// CORS Policy
import cors from "cors";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// Use the imported routers
app.use("/mobileAPI/user", user);
app.use("/mobileAPI/entry", entry);
app.use("/mobileAPI/bus", bus);

// Test backend connection
app.get("/hello", (req, res) => {
  const msg = "Hello I'm Node App!";
  console.log(msg);
  res.json(msg);
});

// DB Controls
app.post("/test", (req, res) => {
  console.log(`Testing`);
  const { query } = req.body;
  console.log(query);

  db.query(query, (err, result) => {
    if (err) {
      console.log(err.message);
      res.status(500).json(err);
    } else {
      res.status(200).json({ reply: "Done", message: result });
    }
  });
});

// Queries

// Getting MAC address
app.post("/mac", (req, res) => {
  macaddress.one((err, mac) => {
    if (err) {
      console.log(err);
      res.json("error");
    } else {
      console.log(`mac: ${mac}`);
      res.json(mac);
    }
  });
});

// Related to userLogs table
app.post("/logs/users", (req, res) => {
  const { type, data } = req.body;

  // Check session Status (active or inactive)
  if (type === "Log1") {
    console.log(
      `New Request::  type: ${type}    Searching about ${data.userID} on ${data.session.MAC}/${data.session.browser}`
    );

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
    db.query(checkSessionSql, values, (err, result) => {
      if (err) {
        console.log(err.message);
        res.json("error");
      } else {
        const sessionCount = result[0].count;
        if (sessionCount > 0) {
          // Session exists, update the row
          db.query(updateSessionSql, updateValues, (err, result) => {
            if (err) {
              console.log(err.message);
              res.json("error");
            } else {
              res.json("active");
              console.log(
                `Server replies as userID: ${data.userID} with status: active\n\n`
              );
            }
          });
        } else {
          // Session does not exist
          res.json("deactive");
          console.log(
            `Server replies as userID: ${data.userID} with status: deactive\n\n`
          );
        }
      }
    });
  }

  // Session terminate
  else if (type === "Log2") {
    console.log(
      `New Request::  type: ${type}    Terminate user ${data.userID} on ${data.MAC}/${data.browser}`
    );

    const sql = `DELETE FROM USER_LOGS 
           WHERE userID = ? AND MAC = ? AND browser = ?`;

    const values = [data.userID, data.MAC, data.browser];

    db.query(sql, values, (err, result) => {
      //console.log(`Session is terminated successfully!\nuserID: ${JSON.parse(data.userID)} browser: ${data.browser} MAC:${data.MAC}`);
      if (err) {
        console.log(err.message + "\n\n");
        res.json("error");
      } else {
        console.log("Entry deleted successfully!\n\n");
        res.json("success");
      }
    });
  }

  // Here you might want to save the user log to the db (request comming from login page)
  else if (type === "Log3") {
    console.log(
      `New Request::  type: ${type}    \nSuccessful login!  userId: ${JSON.stringify(
        data
      )}`
    );
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

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Entry added or updated successfully!");
        res.json("success");
      }
    });
  }

  // Requesting device data from devises
  else if (type === "Log4") {
    console.log(`Type: ${type}   userID: ${data}`);

    const sql = `SELECT logID, device, MAC, OS, browser, country, date, time
           FROM USER_LOGS
           WHERE userID = ?`;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        res.json("error");
      } else {
        console.log(
          `Entry searched successfully!\ndevices: ${JSON.stringify(result)}\n\n`
        );
        res.json(result);
      }
    });
  }
});

// Related to OTP handling
app.post("/OTP", (req, res) => {
  const { type, data } = req.body;

  // Here you might want to generate an OTP and save it
  // ===> (Edit this:: If any error occurs in the process reply as 'error' otherwise reply as 'success')
  if (type === "loginOTP" || type === "signupOTP" || type === "request") {
    let loginOTP = generateOTP();
    sendOTP(data.email, loginOTP);
    console.log(
      `New Request::  type: ${type}    Mobile Number: ${data.mobile}   Email: ${data.email}\n   OTP:: ${loginOTP}\n\n`
    );

    const check_sql = `SELECT otpID FROM OTP_TABLE WHERE contactNo = ?`;

    db.query(check_sql, data.mobile, (err, result) => {
      if (result.length > 0) {
        const update_otp_sql = `UPDATE OTP_TABLE SET otp = ? WHERE contactNo = ?`;
        const values = [loginOTP, data.mobile];

        db.query(update_otp_sql, values, (err) => {
          err ? console.log(err) : res.send(`success`);
        });
      } else {
        const new_entry_sql = `INSERT INTO OTP_TABLE (otp, contactNo, email) VALUES (?)`;
        const values = [loginOTP, data.mobile, data.email];

        db.query(new_entry_sql, [values], (err) => {
          err ? console.log(err) : res.send(`success`);
        });
      }
    });
    // Send reply to frontend saying request is success
  } else if (type === "verify") {
    const email = data.email;
    const sql = `SELECT otp FROM OTP_TABLE WHERE email = ? limit 1`;

    // ==> Problem in the query cannot handle setting page requests
    // ==> Suggestion:: delete the DB entry if the otp is valid. (Handle settings page requests according to the origin)

    db.query(sql, email, (err, response) => {
      if (err) {
        console.log(err);
      } else {
        //console.log(`ServerOTP:${response[0].otp} | UserOTP:${data.value}`);
        const reply = data.value === response[0].otp ? "true" : "false";
        res.send(reply);
      }
    });
    console.log(
      `Authentication::  type: ${type}  Data: ${JSON.stringify(
        data
      )}  User OTP: ${data.value}\n\n`
    );
  }
});

// Related to users table
app.post("/users", (req, res) => {
  const { type, data } = req.body;

  // Here you might want to find userID, email userType, empType from DB and send back to the frontend (request comming from login page)
  if (type === "Req1") {
    console.log(`New Request::  type: ${type}    Mobile Number: ${data}`);

    var userData = {};

    const sql = `SELECT userID, userType, empType, email 
             FROM USERS
             WHERE mobile = ?`;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        userData.userID = "error";
        userData.userType = "error";
        userData.empType = "error";
        userData.email = "error";
        res.json(userData); // Reply with 'error' in case of an error
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
        );
        if (result.length > 0) {
          userData = result[0];
        } else {
          userData.userID = "invalid";
          userData.email = "invalid";
          userData.userType = "invalid";
          userData.empType = "invalid";
        }
        console.log(
          `Server replies as userID: ${userData.userID} with email: ${userData.email}\n\n`
        );
        res.json(userData);
      }
    });
  }

  // Here you might want to find user availability from DB and send back to the frontend (request comming from signup page)
  else if (type === "Req2") {
    console.log(
      `New Request::  type: ${type}        Mobile Number: ${data.mobile}   Email: ${data.email}`
    );
    var userAvailability = "none";

    const sql = `SELECT userID FROM USERS WHERE email = ? OR mobile = ?`;
    const values = [data.email, data.mobile];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        res.json(userAvailability); // Reply with 'none' in case of an error
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
        );
        if (result.length > 0) {
          userAvailability = "false";
        } else {
          userAvailability = "true";
        }
        console.log(
          `Server replies as userAvailability: ${userAvailability}\n\n`
        );
        res.json(userAvailability);
      }
    });
  }

  // Save registed data into db
  else if (type === "Req3") {
    let sql = "";
    let values = [];
    switch (data.userType) {
      case "passenger": {
        // Query for passenger
        sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, credits)
           VALUES (?)`;
        values = [
          data.userType,
          data.empType,
          data.fName,
          data.lName,
          data.email,
          data.mobile,
          0,
        ];
        break;
      }
      case "employee": {
        // Query for employee
        sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, credits)
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
        ];
        break;
      }
      case "owner": {
        if (data.empType !== "None") {
          // Query for owner does not work as an employee
          sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, accName, accNo, bank, branch, credits)
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
          ];
        } else {
          // Query for owner work as an employee
          sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, accName, accNo, bank, branch, credits)
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
          ];
        }
        break;
      }
      default:
        break;
    }
    db.query(sql, [values], (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        return res.json("error");
      } else {
        console.log("Entry added successfully!\n\n");
        return res.json("success");
      }
    });
  }

  // Get data for the general page
  else if (type === "Req4") {
    console.log(
      `New Request (General Page) ::  type: ${type}        UserID: ${data}`
    );

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
        return res.status(500).send("Database query error");
      }

      if (results.length > 0) {
        const userData = results[0];
        console.log(`Server Replies to ${data} as ${JSON.stringify(userData)}`);
        return res.json(userData);
      } else {
        console.log(`No user found with ID: ${data}`);
        return res.status(404).send("User not found");
      }
    });
  }

  // Get all personal details of the user
  else if (type === "Req5") {
    console.log(
      `New Request (Settings Page) ::  type: ${type} \nUser ${data} is requested his infomation.`
    );

    const sql = `
            SELECT userID, userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, accName, accNo, bank, branch
            FROM USERS
            WHERE userID = ?;
            `;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        return res.json("error"); // Reply with 'error' in case of an error
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result[0])}`
        );
        if (result.length > 0) {
          return res.json(result[0]);
        } else {
          return res.json("invalid");
        }
      }
    });
  }

  // Check availability of new data
  else if (type === "Req6") {
    console.log(
      `New Request (Settings Page) ::  type: ${type} \nChecking Availability:: ${JSON.stringify(
        data
      )}`
    );

    const sql = `SELECT userID FROM USERS WHERE userID != ? AND (email = ? OR mobile = ? OR nic = ?)`;
    db.query(
      sql,
      [data.userID, data.email, data.mobile, data.nic],
      (err, result) => {
        if (err) {
          console.log(err.message + "\n\n");
          return res.json("error"); // Reply with 'error' in case of an error
        } else {
          console.log(
            `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
          );
          if (result.length > 0) {
            console.log("ServerResponse: invalid");
            return res.json("invalid");
          } else {
            const sql2 = `SELECT email, mobile, nic FROM USERS WHERE userID = ?`;
            db.query(sql2, [data.userID], (err2, result2) => {
              if (err2) {
                console.log(err2.message + "\n\n");
                return res.json("inner error");
              } else {
                const user = result2[0]; // userID is unique
                if (data.email !== user.email && data.mobile !== user.mobile) {
                  // ===> Send otp to the email and mobile (need to verify both of them)
                  console.log("ServerResponse: emailMobile");
                  return res.json("emailmobile");
                } else if (data.email !== user.email) {
                  // ===> Send OTP to the email (email address has changed. New address need to be verified)
                  console.log("ServerResponse: email");
                  return res.json("email");
                } else if (data.mobile !== user.mobile) {
                  // ===> Send OTP to the mobile (mobile has changed. New mobile need to be verified)
                  console.log("ServerResponse: mobile");
                  return res.json("mobile");
                } else {
                  const sql3 = `UPDATE USERS SET userType=?, empType=?, fName=?, lName=?,
                  email=?, mobile=?, nic=?, birthDay=?, ntc=?, licence=?, accName=?, accNo=?, 
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

                  db.query(sql3, updateData, (err3, result3) => {
                    if (err3) {
                      console.log(err3.message + "\n\n");
                      return res.json("update error"); // Reply with 'update error' in case of an error
                    } else {
                      console.log("ServerResponse: success");
                      return res.json("success");
                    }
                  });
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
        return res.json("update error"); // Reply with 'update error' in case of an error
      } else {
        console.log("ServerResponse: success");
        return res.json("success");
      }
    });
  }

  // Request personal infomation from booking page (==> Need to update)
  else if (type === "Req8") {
    // Frontend send the userID. Then backend need to reply with following fromat. (user is already logged in. No need to check user availability)
    // Reply with 'error' in case of an error
    // Dummy data
    console.log(`New Request::  type: ${type}    data: ${data}`);
    /* res.json({
      name: "John Doe",
      mobile: "94704109990",
      email: "johndoe@gmail.com",
    }); */
    const sql = `SELECT CONCAT(fName, ' ', lName) AS name, mobile, email 
                  FROM USERS 
                  WHERE UserID = ?;
                `;

    db.query(sql, data, (err, result) => {
      if (err) {
        console.log(err.message);
        return res.json("error");
      } else {
        res.json(result[0]);
      }
    });
  } else {
    console.log(`Invalid request type: ${type}`);
    return res.status(400).send("Invalid request type");
  }
});

// Related to transaction table
app.post("/transactions", (req, res) => {
  const { type, data } = req.body;

  // Requesting transaction history from db
  if (type === "Trans1") {
    console.log(`Transaction Request:: type: ${type}  userID: ${data}`);
    // Edit here with suitable query
    const query = `
      SELECT 
        JSON_OBJECT(
            'credits', u.credits,
            'transaction', JSON_ARRAYAGG(
                JSON_OBJECT(
                    'id', LPAD(t.transactionID, 7, '0'),
                    'date', t.date,
                    'time', t.time,
                    'description', t.type,
                    'amount', FORMAT(t.amount, 2)
                )
            )
        ) AS result
      FROM 
          USERS u
      LEFT JOIN 
          TRANSACTION t ON u.UserID = t.userID
      WHERE 
          u.userID = ?
      GROUP BY 
          u.userID, u.credits;
      `;

    db.query(query, data, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Database query error");
      }

      if (results.length > 0) {
        /* console.log(
          `Server Replies to ${data} as ${JSON.stringify(results[0].result)}`
        ); */
        return res.json(results[0].result);
      } else {
        console.log(`Transaction not found with ID: ${data}`);
        return res.status(404).send("Transaction not found");
      }
    });
  } else if (type === "Trans2") {
    console.log(`Confirm refund: Trans2`);

    const sql1 = `SELECT passengerID FROM TICKET WHERE ticketNo = ?`;

    db.query(sql1, parseInt(data.refNo), (err1, result1) => {
      if (err1) {
        console.log(err1.message);
        return res.json("error");
      } else {
        const sql2 = `UPDATE USERS SET credits = credits + ? WHERE userID = ?`;
        const data2 = [data.refund, result1[0].passengerID];

        db.query(sql2, data2, (err2, result2) => {
          if (err2) {
            console.log(err2.message);
            return res.json("error");
          } else {
            if (result2.changedRows < 1) {
              return res.json("error");
            } else {
              const sql3 = `UPDATE TICKET SET status = 'Refunded' WHERE ticketNo = ?`;

              db.query(sql3, parseInt(data.refNo), (err3, result3) => {
                if (err3) {
                  console.log(err3.message);
                  return res.json("error");
                } else {
                  const sql4 = `INSERT INTO TRANSACTION (userID, amount, date, time, refNo, type) VALUES (?)`;

                  const data4 = [
                    result1[0].passengerID,
                    data.refund,
                    data.cancelDate,
                    data.cancelTime,
                    data.refNo,
                    "Refund",
                  ];

                  db.query(sql4, [data4], (err4, result4) => {
                    if (err4) {
                      console.log(err4.message);
                      return res.json("error");
                    } else {
                      return res.json("success");
                    }
                  });
                }
              });
            }
          }
        });
      }
    });
  } else if (type === "Trans3") {
    console.log(`new request: ${JSON.stringify(data)}`);
    res.json("0000025");
  } else if (type === "Trans4") {
    console.log(`new request: ${JSON.stringify(data)}`);
    res.json("success");
  }
});

// Related to ticket table
app.post("/tickets", (req, res) => {
  const { type, data } = req.body;

  // Requesting ticket history from db
  if (type === "Tkt1") {
    console.log(`Ticket Request:: type:${type}  userID: ${data}`);

    // Edit here with suitable query
    const query = `
        SELECT 
          JSON_OBJECT(
              'available', (
                  SELECT COUNT(*)
                  FROM TICKET t2
                  WHERE t2.passengerID = t1.passengerID AND t2.status = 'Available'
              ),
              'tickets', JSON_ARRAYAGG(
                  JSON_OBJECT(
                      'id', LPAD(ticketNo, 7, '0'),
                      'date', issuedDate,
                      'from', fromStop.name,
                      'to', toStop.name,
                      'status', status,
                      'amount', FORMAT(ticketPrice, 2)
                  )
              )
          ) AS result
        FROM TICKET t1
        JOIN 
          BUSSTOP_NAMES fromStop ON t1.fromLocation = fromStop.nameID 
        JOIN 
          BUSSTOP_NAMES toStop ON t1.toLocation = toStop.nameID
        WHERE passengerID = ?
        GROUP BY passengerID;
      `;

    db.query(query, data, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Database query error");
      }
      //console.log(`Tickect count: ${count}`);
      if (results.length > 0) {
        //console.log(`Server Replies to ${data} as ${JSON.stringify(results)}`);
        return res.json(results[0].result);
      } else if (results.length === 0) {
        const serverResponse = {
          available: "0",
          tickets: results,
        };
        /* console.log(
          `Server Replies to ${data} as ${JSON.stringify(serverResponse)}`
        ); */
        return res.json(serverResponse);
      } else {
        console.log(`Tickets not found belongs to userID: ${data}`);
        return res.status(404).send("Tickets Error");
      }
    });
  }

  // Requesting specific ticket (===>Check userID also)
  else if (type === "Tkt2") {
    console.log(
      `Invoice Request:: type: ${type}  Ref.No.: ${JSON.stringify(data)}`
    );
    const query = `
      SELECT 
        JSON_OBJECT(
          'ticketNo', LPAD(t.ticketNo, 7, '0'),
          'customerName', CONCAT(u.fName, ' ', u.lName),
          'customerEmail', u.email,
          'customerMobile', u.mobile,
          'issuedDate', t.issuedDate,
          'issuedTime', t.issuedTime,
          'vehicalNo', v.vehicleRegNo,
          'type', v.serviceType,
          'routeNo', r.routeNo,
          'route', CONCAT(r.start, ' - ', r.end),
          'date', t.jrnDate,
          'time', s.departureTime,
          'from', fromStop.name,
          'to', toStop.name,
          'journey', t.distance,
          'price', FORMAT(t.ticketPrice, 2),
          'full', t.full,
          'half', t.half,
          'seatNos', t.seatNos
        ) AS result
      FROM 
        TICKET t
      JOIN 
        USERS u ON t.passengerID = u.userID
      JOIN
        SCHEDULE s ON s.scheduleID = t.scheduleID
      JOIN
        VEHICLE v ON v.vehicleID = s.vehicleID
      JOIN
        ROUTE r ON r.routeID = s.routeID
      JOIN
        BUSSTOP_NAMES fromStop ON fromStop.nameID = t.fromLocation
      JOIN
        BUSSTOP_NAMES toStop ON toStop.nameID = t.toLocation
      WHERE 
        t.ticketNo = ?
    `;

    db.query(query, data.refNo, (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        return res.status(500).send("Database query error");
      }

      if (results.length > 0) {
        const invoiceData = results[0].result;
        console.log(
          `Server Replies to ${data} as ${JSON.stringify(invoiceData)}`
        );
        return res.json(invoiceData);
      } else {
        console.log(`Invoice not found with RefNo: ${data}`);
        return res.status(404).send("Invoice not found");
      }
    });
  }

  // Requesting ticket confirmation (Ticked is purchased by the user)
  // ===> Send reply to the frontend as 'success' if purchasing is successfull. Otherwise reply as 'error'.
  // ===> Also need to write a suitable query to store the new ticket infomation to the 'ticket' table
  else if (type === "Tkt3") {
    console.log(
      `\nInvoice Request:: type: ${type}  Ticket info.: ${JSON.stringify(
        data
      )}\n`
    );
    
    let totalPrice = parseFloat(data.price) * data.full + (parseFloat(data.price) / 2) * data.half;
    let discount = totalPrice * (data.discount / 100);  

    const sql = `SELECT credits FROM USERS WHERE userID = ?`;
    db.query(sql, data.userID, (err, result) => {    
      if (err) {
        console.log(err.message);
        return res.json("error");
      } else {
        if (result[0].credits >= totalPrice) {
          const sql1 = `UPDATE USERS SET credits = credits - ? WHERE userID = ?`;
          const values1 = [totalPrice, data.userID];

          db.query(sql1, values1, (err1, result1) => {
            if (err1) {
              console.log(err1.message);
              return res.json("error");
            } else {
              console.log("Credits updated successfully!");
              const sql2 = `INSERT INTO TRANSACTION (userID, amount, date, time, type) VALUES (?)`;
              const values2 = [
                data.userID,
                totalPrice,
                data.issuedDate,
                data.issuedTime,
                "Payment",
              ];

              db.query(sql2, [values2], (err2, result2) => {
                if (err2) {
                  console.log(err2.message);
                  return res.json("error");
                } else {
                  const sql3 = `INSERT INTO TICKET (passengerID,issuedDate,issuedTime,jrnDate,jrnStartTime,jrnEndTime,fromLocation,toLocation,distance,half,full,ticketPrice,seatNos,status,scheduleID,transID,discount) VALUES (?)`;

                  const values3 = [
                    data.userID,
                    data.issuedDate,
                    data.issuedTime,
                    data.date,
                    data.aproxDepT,
                    data.aproxAriT,
                    data.from.id,
                    data.to.id,
                    JSON.stringify(parseFloat(data.journey)),
                    data.half,
                    data.full,
                    totalPrice,
                    JSON.stringify(data.seatNos),
                    "Available",
                    data.shceduleId,
                    result2.insertId,
                    discount,
                  ];

                  db.query(sql3, [values3], (err3, result3) => {
                    if (err3) {
                      console.log(err3.message);
                      return res.json("error");
                    } else {
                      console.log("Ticket added successfully!");
                      return res.json("success");
                    }
                  });
                }
              });
            }
          });
        } else {
          res.json("Insufficient");
        }
      }
    });
  } else if (type === "Tkt4") {
    console.log(`Available ticket Request:: type: ${type}  userId:${data}`);

    const sql1 = `SELECT * FROM TICKET WHERE passengerID = ? AND status = 'Available'`;

    db.query(sql1, data, (err, result) => {
      if (err) {
        console.log(err.message);
      } else {
        const user_ticket_data = [];
        const tickets = result.map((ticket) => {
          return new Promise((resolve, reject) => {
            const sql2 = `SELECT 
                    SCHEDULE.departureTime,
                    VEHICLE.vehicleRegNo, 
                    VEHICLE.org, 
                    VEHICLE.serviceType, 
                    ROUTE.routeNo, 
                    ROUTE.start, 
                    ROUTE.end, 
                    fromStop.name AS fromLocation, 
                    toStop.name AS toLocation
                FROM 
                    SCHEDULE 
                JOIN 
                    VEHICLE ON SCHEDULE.vehicleID = VEHICLE.vehicleID 
                JOIN 
                    ROUTE ON SCHEDULE.routeID = ROUTE.routeID 
                JOIN 
                    BUSSTOP_NAMES fromStop ON fromStop.nameID = ? 
                JOIN 
                    BUSSTOP_NAMES toStop ON toStop.nameID = ?
                WHERE 
                    SCHEDULE.scheduleID = ?;`;

            const values2 = [
              ticket.fromLocation,
              ticket.toLocation,
              ticket.scheduleID,
            ];

            db.query(sql2, values2, (err2, result2) => {
              if (err2) {
                console.log(err2.message);
                reject(err2);
              } else {
                const fiveMins = 300000;
                const day = 86400000;
                const now = new Date(Date.now());
                const startDateTime = new Date(
                  `${ticket.jrnDate} ${ticket.jrnStartTime}`
                );
                const endDateTime = new Date(
                  `${ticket.jrnDate} ${ticket.jrnEndTime}`
                );
                let tracking = false;
                let cancel = false;

                if (now.getTime() + day < startDateTime.getTime()) {
                  cancel = true;
                }

                if (
                  now.getTime() + fiveMins > startDateTime.getTime() &&
                  now.getTime() - fiveMins < endDateTime.getTime() &&
                  !cancel
                ) {
                  tracking = true;
                }

                user_ticket_data.push({
                  refNo: ticket.ticketNo.toString().padStart(6, "0"),
                  date: ticket.jrnDate,
                  departure: result2[0].departureTime,
                  fromT: ticket.jrnStartTime,
                  toT: ticket.jrnEndTime,
                  from: result2[0].fromLocation,
                  to: result2[0].toLocation,
                  seats: ticket.seatNos.join(", "),
                  full: ticket.full,
                  half: ticket.half,
                  price: ticket.ticketPrice,
                  regNo: result2[0].vehicleRegNo,
                  org: result2[0].org,
                  service: result2[0].serviceType,
                  route: `${result2[0].routeNo} ${result2[0].start}-${result2[0].end}`,
                  tracking: tracking,
                  cancel: cancel,
                });
                resolve();
              }
            });
          });
        });

        Promise.all(tickets)
          .then(() => {
            // Send the response after all queries are complete
            res.json(user_ticket_data);
          })
          .catch((err) => {
            console.log(err);
            res.json("error");
          });
      }
    });
  } else if (type === "Tkt5") {
    console.log(`Refund request type: ${type} data:${JSON.stringify(data)}`);

    const sql1 = `SELECT issuedDate, issuedTime, ticketPrice FROM TICKET WHERE ticketNo = ?`;

    db.query(sql1, parseInt(data.refNo), (err1, result1) => {
      if (err1) {
        res.json("error");
      } else {
        const timeZoneOffset = 5 * 60 * 60 * 1000 + 30 * 60 * 1000;

        function createAdjustedDate(dateString, timeString) {
          const date = new Date(`${dateString} ${timeString}`);
          return new Date(date.getTime() + timeZoneOffset);
        }

        const issuedDateIST = createAdjustedDate(
          result1[0].issuedDate,
          result1[0].issuedTime
        );
        const cancelDateIST = createAdjustedDate(
          data.cancelDate,
          data.cancelTime
        );

        function calculateDuration(startDate, endDate) {
          const diff = endDate.getTime() - startDate.getTime();

          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );

          return { days, hours };
        }

        const duration = calculateDuration(issuedDateIST, cancelDateIST);

        const refundAmount = result1[0].ticketPrice * 0.75;

        const cancelData = {
          refNo: data.refNo,
          billingDate: issuedDateIST.toISOString().split("T")[0],
          billingTime: issuedDateIST.toISOString().substring(11, 16),
          cancelDate: cancelDateIST.toISOString().split("T")[0],
          cancelTime: cancelDateIST.toISOString().substring(11, 16),
          duration: `${duration.days} days ${duration.hours} hrs`,
          amount: result1[0].ticketPrice,
          refund: refundAmount.toFixed(2),
        };
        res.json(cancelData);
      }
    });
  } else if (type === "Tkt6") {
    console.log(`Tracking request type: ${type} data:${JSON.stringify(data)}`);

    const sql1 = `SELECT 
                      TICKET.jrnDate,
                      TICKET.jrnStartTime,
                      TICKET.jrnEndTime,
                      SCHEDULE.departureTime,
                      VEHICLE.vehicleRegNo, 
                      VEHICLE.org, 
                      VEHICLE.serviceType, 
                      ROUTE.routeNo, 
                      ROUTE.routeType,
                      ROUTE.start, 
                      ROUTE.end, 
                      JSON_OBJECT('name', fromStop.name, 'location', JSON_OBJECT('lat', fromStop.lat, 'lng', fromStop.lng)) AS 'from', 
                      JSON_OBJECT('name', toStop.name, 'location', JSON_OBJECT('lat', toStop.lat, 'lng', toStop.lng)) AS 'to',
                      JSON_OBJECT('name', startStop.name, 'location', JSON_OBJECT('lat', startStop.lat, 'lng', startStop.lng)) AS 'start'
                  FROM 
                      TICKET 
                  JOIN
                      SCHEDULE ON TICKET.scheduleID = SCHEDULE.scheduleID
                  JOIN 
                      VEHICLE ON SCHEDULE.vehicleID = VEHICLE.vehicleID 
                  JOIN 
                      ROUTE ON SCHEDULE.routeID = ROUTE.routeID 
                  JOIN 
                      BUSSTOP_NAMES fromStop ON TICKET.fromLocation = fromStop.nameID 
                  JOIN 
                      BUSSTOP_NAMES toStop ON TICKET.toLocation = toStop.nameID
                  JOIN
                      BUSSTOP_NAMES startStop ON ROUTE.startLocation = startStop.nameID
                  WHERE 
                      TICKET.ticketNo = ?;
                  `;

    db.query(sql1, parseInt(data.ticketNo), (err1, result1) => {
      if (err1) {
        console.log(err1.message);
        return res.json("error");
      } else {
        const fiveMins = 300000;
        const now = new Date(Date.now());
        const startDateTime = new Date(
          `${result1[0].jrnDate} ${result1[0].jrnStartTime}`
        );
        const endDateTime = new Date(
          `${result1[0].jrnDate} ${result1[0].jrnEndTime}`
        );
        let tracking = false;

        if (
          now.getTime() + fiveMins > startDateTime.getTime() &&
          now.getTime() - fiveMins < endDateTime.getTime()
        ) {
          tracking = true;
        }

        const busInfo = {
          refNo: data.ticketNo,
          regNo: result1[0].vehicleRegNo,
          route: `${result1[0].routeNo} ${result1[0].start}-${result1[0].end}`,
          org: result1[0].org,
          service: result1[0].serviceType,
          routeType: result1[0].routeType,
          startT: result1[0].departureTime,
          from: result1[0].from,
          to: result1[0].to,
          start: result1[0].start,
        };

        const routeLocations = [
          result1[0].from.location,
          result1[0].to.location,
        ];

        res.json({
          availability: `${tracking}`,
          busInfo,
          routePoints: routeLocations,
        });
      }
    });

    // Dummy data about bus general info
    /* const busInfo = {
      refNo: "0000112",
      regNo: "NA-1234",
      route: "602 | Kandy - Kurunegala",
      org: "SLTB",
      service: "Semi-Luxury",
      routeType: "expressway",
      startT: "06:10",
      from: {
        name: "Kurunduwatte",
        location: { lat: 7.243630047731192, lng: 80.59471319873906 },
      },
      to: {
        name: "Akbar",
        location: { lat: 7.25235057321553, lng: 80.59333382765641 },
      },
      start: {
        name: "Kandy Market",
        location: { lat: 7.2933810742053575, lng: 80.63447065398826 },
      },
    }; */

    // Dummy route location data
    /* const routeLocations = [
      { lat: 7.243630047731192, lng: 80.59471319873906 },
      { lat: 7.2656183598161075, lng: 80.59577370836975 },
      { lat: 7.288209595790418, lng: 80.63166044283383 },
      { lat: 7.2933810742053575, lng: 80.63447065398826 },
    ]; */
  }
});

// Other Authentication services (NEED TO DISCUSS)
app.post("/other", (req, res) => {
  const { type, data } = req.body;
  console.log(
    `New Request::  type: ${type}    Mobile Number: ${JSON.stringify(data)}`
  );
  let userData = {};

  if (type === "google") {
    console.log("Google Authentication");
    // Verify user, then fetch userData from db and send back to the frontend
    const mobile = 94111111111;

    // This is a tempary query
    const sql = `SELECT userID, userType, empType, email 
             FROM users
             WHERE mobile = ?`;

    db.query(sql, mobile, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        userData.status = "error";
        res.json(userData); // Reply with 'error' in case of an error
      } else {
        console.log(
          `Entry searched successfully!\nUsers: ${JSON.stringify(result)}`
        );
        if (result.length > 0) {
          userData = result[0];
          userData.status = "success";
        } else {
          userData.status = "invalid";
        }

        console.log(`Server replies as ${JSON.stringify(userData)}\n\n`);
        res.json(userData);
      }
    });
  } else {
    console.log("Request Not Found!");
    userData.status = "error";
    res.json(userData);
    //return res.status(404).json('Request Not Found!');
  }
});

// ========================================================= Here onward => Booking Related Requests =====================================================================

// Shcedule data
// Frontend send the {from:fromID, to:toID, date:date}. Then need to fetch the corresponding shedule details according to it and send to the frontend
app.post("/schedule", (req, res) => {
  const { type, data } = req.body;
  console.log(`New Request::  type: ${type}    Data: ${JSON.stringify(data)}`);

  // If there is no busses. reply as a [] empty array.
  if (type === "Sdl1") {
    const sql1 = `SELECT 
                      BUSSTOP_LOCATIONS.lat, 
                      BUSSTOP_LOCATIONS.lng, 
                      BUSSTOP_LOCATIONS.routes, 
                      BUSSTOP_NAMES.name
                  FROM 
                      BUSSTOP_LOCATIONS
                  JOIN 
                      BUSSTOP_NAMES ON BUSSTOP_LOCATIONS.nameID = BUSSTOP_NAMES.nameID
                  WHERE 
                      BUSSTOP_LOCATIONS.nameID IN (?, ?);
                  `;
    const values1 = [data.from, data.to];
    db.query(sql1, values1, async (err1, result1) => {
      try {
        if (err1) {
          console.log(err1.message);
        } else {
          if (result1.length > 1) {
            const busStops = [
              ...new Map(
                result1.map((busStop) => [busStop.name, busStop])
              ).values(),
            ];

            const origin = `${busStops[0].lat}, ${busStops[0].lng}`;
            const destination = `${busStops[1].lat}, ${busStops[1].lng}`;
            const commonRoutes = busStops[0].routes.filter((route) =>
              busStops[1].routes.includes(route)
            );

            if (commonRoutes.length > 0) {
              const details = await journeyDetails(origin, destination);

              const sql2 = `SELECT 
                        s.scheduleID AS 'id',
                        v.vehicleRegNo AS 'regNo',
                        v.serviceType AS 'service',
                        r.routeType,
                        r.routeNo,  
                        v.org,
                        s.bookedSeats AS 'booked',
                        v.seats,
                        s.closingDate AS 'closing'
                      FROM 
                        ROUTE r
                      JOIN 
                        SCHEDULE s ON r.routeID = s.routeID
                      JOIN 
                        VEHICLE v ON s.vehicleID = v.vehicleID
                      WHERE 
                        r.routeNo IN (?)
                        AND s.closingDate > DATE_ADD(NOW(), INTERVAL 1 DAY)
                        AND s.closingDate <= DATE_ADD(NOW(), INTERVAL 8 DAY);
                      `;

              db.query(sql2, [commonRoutes], (err2, result2) => {
                if (err2) {
                  console.log(err2.message);
                } else {
                  let scheduleDetails = result2.map((result) => {
                    return {
                      ...result,
                      ...details,
                      from: busStops[0].name,
                      to: busStops[1].name,
                      price: "30.00",
                    };
                  });

                  for (let i = 0; i < scheduleDetails.length; i++) {
                    scheduleDetails[i].id = (i + 1).toString();
                  }

                  //console.log(scheduleDetails);
                  res.json(scheduleDetails);
                }
              });
            } else {
              res.json([]);
            }
          } else {
            res.json("error");
          }
        }
      } catch (error) {
        console.log(error);
        res.json("error");
      }
    });
  }
});

// Getting bus stop locations (Get them from busstopLocation (add suitable name to the table) table)
app.get("/busstops/locations", (req, res) => {
  // Front end send the margin of the requested area {north, south, east, west} then find the corresponding busstops in that area
  // and send to the frontend in above fromat. If there are no busstpos send and empty array []
  console.log(`requesting bus holt locations`);

  const sql = `SELECT BUSSTOP_LOCATIONS.locationID AS id, BUSSTOP_NAMES.name, BUSSTOP_LOCATIONS.routes, JSON_OBJECT('lat', BUSSTOP_LOCATIONS.lat, 'lng', BUSSTOP_LOCATIONS.lng) AS location
                    FROM BUSSTOP_LOCATIONS
                    JOIN BUSSTOP_NAMES ON BUSSTOP_LOCATIONS.nameID = BUSSTOP_NAMES.nameID;
                  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      //console.log(result);
      res.json(result);
    }
  });
});

// Getting bus stop names
app.get("/busstops/names", async (req, res) => {
  // Frnotend requst all busstops names (another table) send them to frontend
  console.log(`requesting busHalt names`);

  const sql =
    "SELECT nameID AS id, name, JSON_OBJECT('lat', lat, 'lng', lng) AS location FROM BUSSTOP_NAMES";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err.message);
    } else {
      res.json(result);
    }
  });
});

// Getting route infomation
app.get("/routes/availability", (req, res) => {
  const { origin, destination } = req.body;
  console.log(
    `Trip from ${JSON.stringify(origin)} to ${JSON.stringify(destination)}`
  );
  res.json("true");
});

// Getting tracking infomations
app.get("/tracking/bus", (req, res) => {
  //console.log(`Tracking bus!`, req.query);
  // Dummy live data

  const sql = `
                SELECT 
                    JSON_OBJECT(
                        'lat', lat,
                        'lng', lng
                    ) AS location
                FROM 
                    BUS_LOCATIONS
                ORDER BY 
                    id DESC
                LIMIT 1;
              `;

  /* db.query(sql, (err, result) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message }); // Handle error and send response
    } else if (result.length === 0) {
      res.status(404).json({ message: "No location data found" }); // Handle no data found
    } else {
      console.log("Bus location data fetched successfully", result);
      res.status(200).json(result[0].location); // Send the JSON location data
    }
  }); */

  //res.json(liveData);
  console.log("Location was sent.");
});

// Getting tracking estimations
app.get("/tracking/estm", (req, res) => {
  console.log(`Requesting Estimations! ${JSON.stringify(req.body)}`);

  // Dummy estimation data
  const estmData = {
    speed: "40.00",
    fromArT: "10:23",
    toArT: "10:50",
  };

  res.json(estmData);
  console.log("Estimation was sent.");
});

app.post("/tracking/livebus", (req, res) => {
  console.log(`Saving bus locations:: ${JSON.stringify(req.body)}`);

  const { regNo, lat, lng, speed } = req.body;

  const sql = `INSERT INTO busLocation (regNo, lat, lng, speed) VALUES (?, ?, ?, ?);`;

  const values = [regNo, lat, lng, speed];

  // Execute the query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err.message);
      // Handle error
    } else {
      console.log("Bus location data added successfully", result.insertId);
      // Handle success
    }
  });
});

app.get("/tracking/mybuses", (req, res) => {
  console.log("My bus locations are requesting.");

  // Dummy data for bus locations
  const trackdata = [
    {
      regNo: "NA-1234",
      location: { lat: 7.2536300477311, lng: 80.59571319873906 },
    },
    {
      regNo: "NA-1235",
      location: { lat: 7.25335057321553, lng: 80.59433382765641 },
    },
    {
      regNo: "NB-1236",
      location: { lat: 7.26416663555505, lng: 80.59396904470439 },
    },
  ];

  res.json(trackdata);
});

app.get("/bus/mybuses", (req, res) => {
  console.log("Bus names arte requesting.");
  // Dummy Data
  const names = [
    "NA-1234",
    "NB-4567",
    "NC-5462",
    "NA-1235",
    "NA-4456",
    "NA-6566",
    "NB-1236",
    "NC-8796",
    "ND-4546",
    "ND-4656",
  ];

  const details = [
    {
      regNo: "NA-1234",
      route: "507 | Kegalle - Kurunegala",
      routeType: "expressway",
      driver: "Ranil Rajapaksha",
      conductor: "Mahinda Wikramasinghe",
    },
    {
      regNo: "NA-1235",
      route: "508 | Rambukkana - Kurunegala",
      routeType: "expressway",
      driver: "Ranil Rajapaksha",
      conductor: "Mahinda Wikramasinghe",
    },
    {
      regNo: "NB-1236",
      route: "602 | Kandy - Kurunegala",
      routeType: "expressway",
      driver: "Ranil Rajapaksha",
      conductor: "Mahinda Wikramasinghe",
    },
    {
      regNo: "ND-4656",
      route: "507 | Kegalle - Kurunegala",
      routeType: "normalway",
      driver: "Ranil Rajapaksha",
      conductor: "Mahinda Wikramasinghe",
    },
  ];

  res.json({ regNos: names, general: details });
});

app.get("/bus/info", (req, res) => {
  // Dummy data
  const Busses = [
    {
      id: "1",
      regNo: "NA-1316",
      service: "Normal",
      seats: 42,
      rides: 7442,
      ridesIncrement: -2.7,
      earning: 97922.41,
      earningIncrement: 11.7,
      rating: 0.1,
      insuranceExp: "2024-10-10",
      VRL_Exp: "2024-09-06",
    },
    {
      id: "2",
      regNo: "NB-3020",
      service: "Semi-Luxury",
      seats: 33,
      rides: 3378,
      ridesIncrement: 73.0,
      earning: 53132.19,
      earningIncrement: 48.4,
      rating: 2.8,
      insuranceExp: "2024-09-23",
      VRL_Exp: "2024-11-25",
    },
    {
      id: "3",
      regNo: "NC-5485",
      service: "Super-Luxury",
      seats: 42,
      rides: 3524,
      ridesIncrement: 2.3,
      earning: 91355.3,
      earningIncrement: -85.8,
      rating: 0.4,
      insuranceExp: "2024-07-19",
      VRL_Exp: "2023-11-01",
    },
    {
      id: "4",
      regNo: "NA-7030",
      service: "Luxury",
      seats: 33,
      rides: 1120,
      ridesIncrement: -16.6,
      earning: 84842.86,
      earningIncrement: 0,
      rating: 4.9,
      insuranceExp: "2024-02-24",
      VRL_Exp: "2024-02-09",
    },
    {
      id: "5",
      regNo: "NC-1766",
      service: "Normal",
      seats: 33,
      rides: 5581,
      ridesIncrement: 0,
      earning: 4833.15,
      earningIncrement: 87.8,
      rating: 0.8,
      insuranceExp: "2024-01-24",
      VRL_Exp: "2024-04-16",
    },
  ];

  console.log("Requesting bus details");
  res.json(Busses);
});

app.get("/bus/delete", (req, res) => {
  console.log("Entry deleted successfully");
  res.json("success");
});

app.get("/bus/add", (req, res) => {
  console.log("Entry added successfully   Data: ", req.body);
  res.json("success");
});

app.get("/bus/update", (req, res) => {
  console.log("Entry updated successfully.   Data: ", req.body);
  res.json("success");
});

app.get("/bus/income", (req, res) => {
  console.log("Requesting bus income");

  // Type 1 : weekly data
  const receivedData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
  const refundData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
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

  // Type 2 : Monthly data

  // Type 3 : Annual data

  res.json({ receivedData, refundData, earningData, xLabels });
});

app.get("/bus/schedule", (req, res) => {
  console.log("Requesting bus schedule data");

  // Dummy schedules
  const ScheduleList = [
    {
      id: "1",
      status: "active",
      passengers: "52",
      departure: { time: "10:50", place: "Udupussallawa" },
      arrival: { time: "10:40", place: "Udupussallawa" },
      route: "602 | Kandy - Kurunegala",
      distance: "47",
      duration: "1hrs 50min",
      routeType: "Expressway",
    },
    {
      id: "2",
      status: "replace",
      passengers: "52",
      departure: { time: "10:50", place: "Udupussallawa" },
      arrival: { time: "10:40", place: "Udupussallawa" },
      route: "602 | Kandy - Kurunegala",
      distance: "47",
      duration: "1hrs 50min",
      routeType: "Expressway",
      other: { repVehiNum: "NA-1234" },
    },
    {
      id: "3",
      status: "cancel",
      passengers: "52",
      departure: { time: "10:50", place: "Udupussallawa" },
      arrival: { time: "10:40", place: "Udupussallawa" },
      route: "602 | Kandy - Kurunegala",
      distance: "47",
      duration: "1hrs 50min",
      routeType: "Expressway",
    },
    {
      id: "4",
      status: "awaiting",
      passengers: "52",
      departure: { time: "10:50", place: "Udupussallawa" },
      arrival: { time: "10:40", place: "Udupussallawa" },
      route: "602 | Kandy - Kurunegala",
      distance: "47",
      duration: "1hrs 50min",
      routeType: "Expressway",
      other: { name: "Mr. John Doe", vehiNum: "NA-1234" },
    },
    {
      id: "5",
      status: "pending",
      passengers: "52",
      repVehiNum: "NA-1234",
      departure: { time: "10:50", place: "Udupussallawa" },
      arrival: { time: "10:40", place: "Udupussallawa" },
      route: "602 | Kandy - Kurunegala",
      distance: "47",
      duration: "1hrs 50min",
      routeType: "Expressway",
    },
  ];

  res.json(ScheduleList);
});

app.get("/bus/general", (req, res) => {
  console.log("Requesting bus income");

  // Dummy bus data
  const busData = {
    regNo: "NA-1234",
    org: "SLTB",
    service: "Super-Luxury",
    rides: { amount: "300", increment: "25" },
    bookings: { amount: "5000", increment: "-20" },
    cancel: { amount: "2", increment: "10" },
    earn: { amount: "10520", increment: "18" },
  };

  res.json(busData);
});

app.get("/bus/schedule/update", (req, res) => {
  console.log("Updating bus schedule data");
  res.json("success");
});

app.get("/income/general", (req, res) => {
  console.log("Requesting income/general data");
  const incomeData = {
    earning: { amount: 50000, increment: 25 },
    withdraw: { amount: 20000, increment: -10 },
    balance: { amount: 30000, increment: 10 },
    credits: { amount: 40000, increment: 10 },
  };
  res.json(incomeData);
});

app.get("/income/summary", (req, res) => {
  console.log("Requesting Summary");
  const SUM = [
    { data: [1, 2, 5, 38, 5], label: "NA-1234" },
    { data: [1, 2, 5, 38, 5], label: "NA-1354" },
    { data: [1, 2, 5, 38, 5], label: "NC-5645" },
    { data: [1, 2, 5, 38, 5], label: "NC-5685" },
    { data: [1, 2, 5, 38, 5], label: "NC-5646" },
    { data: [1, 2, 5, 38, 5], label: "NA-1534" },
    { data: [1, 2, 5, 38, 5], label: "NA-1654" },
    { data: [1, 2, 5, 38, 5], label: "NC-5845" },
    { data: [1, 2, 5, 38, 5], label: "NC-5885" },
    { data: [1, 2, 5, 38, 5], label: "NC-5686" },
  ];
  res.json(SUM);
});

app.get("/income/income", (req, res) => {
  const graphData = [
    { id: 0, value: 10, label: "NA-1234" },
    { id: 1, value: 15, label: "NA-1354" },
    { id: 2, value: 20, label: "NC-5645" },
    { id: 4, value: 10, label: "NA-1284" },
    { id: 5, value: 15, label: "NA-1364" },
    { id: 6, value: 20, label: "NC-5945" },
    { id: 7, value: 10, label: "NA-1634" },
    { id: 8, value: 15, label: "NA-1854" },
    { id: 9, value: 20, label: "NC-5845" },
  ];
  res.json({ graphData, earning: 500000 });
});

app.get("/feedback/get", (req, res) => {
  // Dummy data
  const TESTIMONIALS = [
    {
      id: 1,
      name: "Edlin Noar",
      userType: "Bus Owner",
      rating: 4.9,
      note: "Fusce consequat. Nulla nisl. Nunc nisl.",
    },
    {
      id: 2,
      name: "Clyde McGeachey",
      userType: "Employee",
      rating: 3.8,
      note: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\nSuspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    },
    {
      id: 3,
      name: "Bengt Wozencroft",
      userType: "Bus Owner",
      rating: 2.6,
      note: "In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    },
    {
      id: 4,
      name: "Marsha Kuhnhardt",
      userType: "Employee",
      rating: 3.5,
      note: "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.",
    },
    {
      id: 5,
      name: "Martica Folder",
      userType: "Passenger",
      rating: 0.7,
      note: "Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
    },
    {
      id: 6,
      name: "Giff Pepperd",
      userType: "Passenger",
      rating: 4.9,
      note: "Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.\n\nPellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.\n\nCum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
    },
    {
      id: 7,
      name: "Nady Bothie",
      userType: "Passenger",
      rating: 2.3,
      note: "Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    },
    {
      id: 8,
      name: "Kristy McCleary",
      userType: "Passenger",
      rating: 0.7,
      note: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
    },
    {
      id: 9,
      name: "Sloane Matyushonok",
      userType: "Passenger",
      rating: 4.4,
      note: "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.\n\nIn quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.\n\nMaecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
    },
    {
      id: 10,
      name: "Demetris Preist",
      userType: "Employee",
      rating: 1.0,
      note: "Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.\n\nNullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris.\n\nMorbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.",
    },
  ];

  console.log("Requesting feedbacks");
  res.json(TESTIMONIALS);
});

app.get("/feedback/new", (req, res) => {
  console.log("New feedback recieved");
  res.json("success");
});

app.get("/feedback/message", (req, res) => {
  console.log("New message recieved");
  res.json("success");
});

app.get("/news/all", (req, res) => {
  console.log("Requesting News");
  const newsItems = [
    {
      title: "Summer Sale: 50% Off on All Tickets!",
      description:
        "Enjoy a massive discount on all our bus tickets this summer. Book your tickets now and save 50% on your journey!",
      date: "August 10, 2024",
      image: "https://picsum.photos/100/100", // Replace with actual image URL
      link: "/offers/summer-sale",
    },
    {
      title: "New Routes Added!",
      description:
        "We are excited to announce new routes in the western region. Explore new destinations with our expanded network.",
      date: "August 8, 2024",
      image: "https://picsum.photos/120/140",
      link: "/news/new-routes",
    },
    {
      title: "Exclusive Offer for Members",
      description:
        "Our members enjoy an exclusive 10% discount on all bookings. Join our membership program today!",
      date: "August 5, 2024",
      image: "https://picsum.photos/160/150",
      link: "/offers/member-discount",
    },
    {
      title: "Exclusive Offer for Members",
      description:
        "Our members enjoy an exclusive 10% discount on all bookings. Join our membership program today!",
      date: "August 5, 2024",
      image: "https://picsum.photos/150/170",
      link: "/offers/member-discount",
    },
    {
      title: "Exclusive Offer for Members",
      description:
        "Our members enjoy an exclusive 10% discount on all bookings. Join our membership program today!",
      date: "August 5, 2024",
      image: "https://picsum.photos/10/150",
      link: "/offers/member-discount",
    },
    {
      title: "Exclusive Offer for Members",
      description:
        "Our members enjoy an exclusive 10% discount on all bookings. Join our membership program today!",
      date: "August 5, 2024",
      image: "https://picsum.photos/150/10",
      link: "/offers/member-discount",
    },
    // Add more news items here...
  ];
  res.json(newsItems);
});

app.get("/team", (req, res) => {
  console.log("Requesting Team infomation");
  const teamMembers = [
    {
      name: "John Doe",
      title: "CEO",
      bio: "John is the visionary behind eConductor.",
      avatar: "https://picsum.photos/150/100",
    },
    {
      name: "Jane Smith",
      title: "CTO",
      bio: "Jane leads the technology team with a focus on innovation.",
      avatar: "https://picsum.photos/170/100",
    },
    {
      name: "Bat Man",
      title: "Director",
      bio: "Johnathen leads the technology team with a focus on innovation.",
      avatar: "https://picsum.photos/100/190",
    },
    {
      name: "Anne Eater",
      title: "Director",
      bio: "Anne leads the technology team with a focus on innovation.",
      avatar: "https://picsum.photos/100/10",
    },
  ];
  res.json(teamMembers);
});
