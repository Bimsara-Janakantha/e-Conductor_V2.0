import "dotenv/config";
import app from "./app.js";
import { db } from "./db.js";

// Start the server
const PORT = process.env.MYNODEPORT;

// Test the database connection
(async () => {
  try {
    // Try a simple query to test the pool connection
    const [rows] = await db.query("SELECT 1");
    console.log("Connected to the database");

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1); // Exit the process with failure
  }
})();
