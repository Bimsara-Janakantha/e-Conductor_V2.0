import express from "express";
import cors from "cors";
import { db } from "../db.js";

const app = express();
const router = express.Router();

// Handle requesting user info related tasks
router.post("/info", (req, res) => {
  const { type, data } = req.body;

  if (type === "reqestInfo") {
    // Fetch user data by phone number
    console.log(`New Request::  type: ${type}    Mobile Number: ${data}`);

    const sql = `SELECT userID, userType, empType, fName, lName, email, mobile, nic, birthday, ntc, licence, accName, accNo, bank, branch, credits 
                 FROM USERS 
                 WHERE mobile = ?`;

    db.query(sql, [data], (err, result) => {
      if (err) {
        console.error(`Database query error: ${err.message}`);
        res
          .status(500)
          .json({ error: "An error occurred while fetching user data." }); // Send proper error response
      } else if (result.length > 0) {
        console.log(
          `User data retrieved successfully: ${JSON.stringify(result[0])}`
        );
        res.status(200).json(result[0]); // Send the full user data to the frontend
      } else {
        console.log(`No user found with mobile number: ${data}`);
        res
          .status(404)
          .json({ error: "No user found with the provided phone number." }); // Handle case where no user is found
      }
    });
  } else {
    res.status(400).json({ error: "Invalid request type." }); // Handle invalid request type
  }
});

// Handle inserting/updateing user info related tasks
router.post("/add", (req, res) => {
  const { type, data } = req.body;

  // Handle new user insertion
  if (type === "newUser") {
    const {
      userID,
      userType,
      empType,
      fName,
      lName,
      email,
      mobile,
      nic,
      birthday,
      ntc,
      licence,
      accName,
      accNo,
      bank,
      branch,
      credits,
    } = data;

    const sql = `INSERT INTO USERS (userID, userType, empType, fName, lName, email, mobile, nic, birthday, ntc, licence, accName, accNo, bank, branch, credits) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      sql,
      [
        userID,
        userType,
        empType,
        fName,
        lName,
        email,
        mobile,
        nic,
        birthday,
        ntc,
        licence,
        accName,
        accNo,
        bank,
        branch,
        credits,
      ],
      (err, result) => {
        if (err) {
          console.error(`Database insertion error: ${err.message}`);
          res
            .status(500)
            .json({ error: "An error occurred while inserting user data." });
        } else {
          console.log(
            `User data inserted successfully: ${JSON.stringify(result)}`
          );
          res.status(201).json({ message: "User data inserted successfully." });
        }
      }
    );
  }
  // Handle bank details update
  else if (type === "bankDetails") {
    const { userID, nic, accName, accNo, bank, branch } = data;

    const sql = `UPDATE USERS SET accName = ?, accNo = ?, bank = ?, branch = ? WHERE userID = ? AND nic = ?`;

    db.query(
      sql,
      [accName, accNo, bank, branch, userID, nic],
      (err, result) => {
        if (err) {
          console.error(`Database update error: ${err.message}`);
          res
            .status(500)
            .json({ error: "An error occurred while updating bank details." });
        } else {
          console.log(
            `Bank details updated successfully: ${JSON.stringify(result)}`
          );
          res
            .status(200)
            .json({ message: "Bank details updated successfully." });
        }
      }
    );
  }
  // Handle licence details update
  else if (type === "licenceDetails") {
    const { userID, nic, ntc, empType, licence } = data;

    const sql = `UPDATE USERS SET licence = ?, ntc = ?, empType = ? WHERE userID = ? AND nic = ?`;

    db.query(sql, [licence, ntc, empType, userID, nic], (err, result) => {
      if (err) {
        console.error(`Database update error: ${err.message}`);
        res
          .status(500)
          .json({ error: "An error occurred while updating licence details." });
      } else {
        console.log(
          `Licence details updated successfully: ${JSON.stringify(result)}`
        );
        res
          .status(200)
          .json({ message: "Licence details updated successfully." });
      }
    });
  }
  // Handle invalid request type
  else {
    res.status(400).json({ error: "Invalid request type." });
  }
});

router.post("/users", (req, res) => {
  const { type, data } = req.body;

  if (type === "Req3") {
    // Handle adding a new user
    let sql = "";
    let values = [];

    switch (data.userType) {
      case "passenger": {
        sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, credits)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
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
        sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, credits)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
          sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, ntc, licence, accName, accNo, bank, branch, credits)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
          sql = `INSERT INTO USERS (userType, empType, fName, lName, email, mobile, nic, birthDay, accName, accNo, bank, branch, credits)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
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
        return res.status(400).json("Invalid user type");
    }

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err.message + "\n\n");
        return res.json("error");
      } else {
        console.log("Entry added successfully!\n\n");
        return res.json("success");
      }
    });
  }

  // Handle other types of requests here...
});

// Define your route
router.get("/details", (req, res) => {
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

export default router;
