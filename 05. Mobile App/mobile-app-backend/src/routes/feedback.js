import express from "express";
import { feedback } from "../controllers/Feedback/feedback.js";

const router = express.Router();

router.get("/", feedback);

export default router;
