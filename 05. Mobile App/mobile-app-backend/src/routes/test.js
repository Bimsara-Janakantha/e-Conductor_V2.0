import express from "express";
import { dbTest } from "../controllers/test.js";

const router = express.Router();

router.post("/", dbTest);

export default router;
