import { db } from "../db.js";

export const dbTest = async (req, res, next) => {
  console.log("\nTESTING!!");

  try {
    const { query } = req.body;
    console.log("query: ", query);

    const [result] = await db.query(query);

    console.log("Results: ", result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
