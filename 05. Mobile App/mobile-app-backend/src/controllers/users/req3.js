import createHttpError from "http-errors";
import { db } from "../../db.js";

// Save registed data into db
const Req3 = async (req, res, next) => {
  const { data } = req.body;
  console.log("\nREQ 3:: Registering new user!", data);

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
  try {
    await db.query(sql, [values]);
    console.log("Entry added successfully!\n\n");
    res.status(201).json("success");
  } catch (err) {
    console.log(err.message + "\n");
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Req3;
