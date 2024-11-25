import createHttpError from "http-errors";
import { db } from "../../db.js";

// Get all personal details of the user based on mobile number
const Req5 = async (req, res, next) => {
  const { data: mobileNumber } = req.body; // Expect mobile number from the frontend
  console.log("\nREQ 5 :: Settings Page Request. User Mobile Number:", mobileNumber);

  const userSql = `
            SELECT 
                userID, 
                userType, 
                empType, 
                fName, 
                lName, 
                email, 
                mobile, 
                nic, 
                birthDay, 
                ntc, 
                licence, 
                accName, 
                accNo, 
                bank, 
                branch, 
                credits
            FROM USERS
            WHERE mobile = ?;
            `;

  const discountSql = `
            SELECT value AS discountPercentage
            FROM GENERAL
            WHERE item = 'discountPercentage';
            `;

  try {
    // Fetch user details
    const [userResult] = await db.query(userSql, [mobileNumber]);

    if (userResult.length > 0) {
      // Fetch discount percentage
      const [discountResult] = await db.query(discountSql);

      // Add discount percentage to the user result
      const userDetails = { 
        ...userResult[0], 
        discountPercentage: discountResult[0]?.discountPercentage || 0 
      };

      console.log(`Entry searched successfully!\nUsers: ${JSON.stringify(userDetails)}`);
      res.status(200).json(userDetails);
    } else {
      // Send a success response with a message instead of a 404 error
      console.log("No user found for mobile number:", mobileNumber);
      res.status(200).json({ error: "Data not found" }); // Send a 200 response with a message
    }
  } catch (err) {
    console.error("Error executing query:", err.message);
    next(createHttpError(503, "Database connection failed!"));
  }
};

export default Req5;
