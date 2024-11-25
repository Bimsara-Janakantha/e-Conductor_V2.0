import createHttpError from "http-errors";
import { db } from "../../db.js";

const Rating = async (req, res, next) => {
  const { userID, refNo, stars} = req.body;
  console.log(`Ratings bus with ${stars} which ticket: ${refNo} belongs to`);

  try {

    console.log("Feedback received!");
    res.status(200).json({ message: "Feedback received!" });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default Rating;
