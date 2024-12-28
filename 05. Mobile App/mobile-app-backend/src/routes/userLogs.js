import express from "express";
import {
  addLogs,
  deleteLog,
  getLogs,
  updateLogs,
} from "../controllers/usersLogs/userLogs.js";

const router = express.Router();

router.post("/", addLogs);

router.delete("/", deleteLog);

router.get("/", getLogs);

router.patch("/", updateLogs);

export default router;
