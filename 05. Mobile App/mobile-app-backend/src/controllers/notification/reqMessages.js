import createHttpError from "http-errors";
import { db } from "../../db.js";

// Function to retrieve user messages
const ReqMessages = async (req, res, next) => {
  const { userID } = req.body;

  console.log(`Fetching messages for userID: ${userID}`);

  if (!userID) {
    return next(createHttpError(400, "Missing required field: userID."));
  }

  try {
    // const messages = await db.query(
    //   `
    //   SELECT title, message, date
    //   FROM MESSAGES
    //   WHERE userID = ?
    //   ORDER BY date DESC
    //   `,
    //   [userID]
    // );

    const messages = [
      {
        title: "Welcome",
        message: "Welcome to the app!",
        date: "2024-10-01",
      },
      {
        title: "Update",
        message: "New features have been added.",
        date: "2024-10-05",
      },
    ];

    console.log(`Fetched messages for userID ${userID}:`, messages);
    res.json(messages);
  } catch (error) {
    console.error("Error occurred while fetching messages:", error.message);
    next(createHttpError(503, "Failed to retrieve messages."));
  }
};

export default ReqMessages;
