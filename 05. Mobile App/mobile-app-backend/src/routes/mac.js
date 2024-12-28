import express from "express";
import { getMac } from "../controllers/mac/mac.js";

const router = express.Router();

router.get("/", getMac);

export default router;
