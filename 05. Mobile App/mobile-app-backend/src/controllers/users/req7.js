import createHttpError from "http-errors";
import { db } from "../../db.js";

// Update db with userData, after verification in settings page
const Req7 = async (req, res, next) => {
  const { data } = req.body; // Access `data` first and then `userData`
  
  if (!data || !data.userData) {
    return next(createHttpError(400, "Invalid request: Missing user data."));
  }

  const userData = data.userData;
  console.log("\nREQ 7:: Updating existing user:", userData);

  const sql = `UPDATE USERS SET userType=?, empType=?, fName=?, lName=?, email=?, mobile=?, nic=?, birthDay=?, ntc=?, licence=?, accName=?, accNo=?, 
                bank=?, branch=? WHERE userID=?`;

  const updateData = [
    userData.userType,
    userData.empType,
    userData.fName,
    userData.lName,
    userData.email,
    userData.mobile,
    userData.nic,
    userData.birthDay,
    userData.ntc,
    userData.licence,
    userData.accName,
    userData.accNo,
    userData.bank,
    userData.branch,
    userData.userID,
  ];

  try {
    // Log the SQL and updateData for debugging
    console.log("SQL Query:", sql);
    console.log("Update Data:", updateData);

    const [result] = await db.query(sql, updateData);

    // Check if any row was actually updated
    console.log("Result:", result);
    console.log("Rows affected:", result.affectedRows);

    if (result.affectedRows === 0) {
      // No rows were updated, possibly because userID does not exist
      return res.status(404).json({ message: "No user found with the given userID" });
    }

    console.log("ServerResponse: success");
    res.status(200).json("success");
  } catch (err) {
    console.log("Error:", err.message + "\n\n");
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Req7;
